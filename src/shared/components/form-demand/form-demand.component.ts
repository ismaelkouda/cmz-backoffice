import { IFormDemandValues } from './data-access/enums/form-demand-values.interface';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { SharedService } from '../../services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { distinctUntilChanged, Observable, Subject, takeUntil } from 'rxjs';
const Swal = require('sweetalert2');
import { SWALWITHBOOTSTRAPBUTTONSPARAMS } from '../../constants/swalWithBootstrapButtonsParams.constant';
import { ToastrService } from 'ngx-toastr';
import { handle } from '../../functions/api.function';
import { FormDemandApiService } from './data-access/services/form-demand-api.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { formDataBuilder } from '../../constants/formDataBuilder.constant';
import {
    OperationTransaction,
    T_OPERATION,
} from '../../enum/OperationTransaction.enum';
import {
    TABLE_FORM_MASS_DEMAND,
    TABLE_FORM_SIMPLE_DEMAND,
} from './data-access/contantes/form-demand-table';
import { TableConfig } from '../../services/table-export-excel-file.service';
import { ClipboardService } from 'ngx-clipboard';
import { TranslateService } from '@ngx-translate/core';
import { UsageInterface } from '../../interfaces/usage.interface';
import { FormulasInterface } from '../../interfaces/formulas.interface';
import { SecondLevelInterface } from '@shared/interfaces/first-level.interface';
import { SecondLevelService } from '@shared/services/second-level.service';
import {
    SIM_IMPORTATION,
    MOBILE_SUBSCRIPTIONS,
} from '../../../presentation/pages/requests-services/requests-services-routing.module';
import {
    PATRIMONY,
    REQUESTS_PRODUCTS,
    REQUESTS_SERVICES,
} from '../../routes/routes';
import { FirstLevelInterface } from '../../interfaces/first-level.interface';
import { ThirdLevelInterface } from '../../interfaces/third-level.interface';
import { SupervisionOperationService } from '../../../presentation/pages/supervision-operations/data-access/supervision-operation.service';
import { EncodingDataService } from '../../services/encoding-data.service';
import { TokenInterface } from '../../interfaces/token.interface';
import { CurrentUser } from '../../interfaces/current-user.interface';

type TYPEVIEW =
    | 'mass-add-mobile-subscription'
    | 'simple-add-mobile-subscription'
    | 'mass-add-importation'
    | 'simple-add-importation'
    | 'mass-add-white-sim'
    | 'simple-add-white-sim';
const TYPEVIEW_VALUES: TYPEVIEW[] = [
    'mass-add-mobile-subscription',
    'simple-add-mobile-subscription',
    'mass-add-importation',
    'simple-add-importation',
    'mass-add-white-sim',
    'simple-add-white-sim',
];
function isTypeView(value: any): value is TYPEVIEW {
    return TYPEVIEW_VALUES.includes(value);
}

@Component({
    selector: 'app-form-demand',
    templateUrl: './form-demand.component.html',
    styleUrls: ['./form-demand.component.scss'],
})
export class FormDemandComponent implements OnInit, OnDestroy {
    public module: string;
    public subModule: string;
    public firstLevelLibel: string | undefined;
    public secondLevelLibel: string | undefined;
    public thirdLevelLibel: string | undefined;
    public listFirstLevel$: Observable<Array<FirstLevelInterface>>;
    public listSecondLevel$: Observable<Array<SecondLevelInterface>>;
    public listThirdLevel$: Observable<Array<ThirdLevelInterface>>;
    public listUsages$: Observable<Array<UsageInterface>>;
    public listFormulas$: Observable<Array<FormulasInterface>>;
    public demandPrice: number = 0;
    public formDemand!: FormGroup<IFormDemandValues>;
    public urlParamRef: TYPEVIEW;
    public urlParamId: string;
    public urlParamTypeDemand: T_OPERATION;
    public displayUrlErrorPage: boolean = false;
    public whiteSimCardDialogVisible: boolean = false;
    public totalLotWhiteSimCardAvailable: number = 0;
    public listWhiteSimCardAvailable: Array<any> = [];
    public expandedRows: Object = {};
    public initialRowValue: number;
    public editableRowIndex: number | null = null;
    public clonedWhiteSimCard: { [string: string]: any } = {};
    public globalWhiteSimCardEditRow: Array<any> = [];
    public totalWhiteSimCardSelected: number = 0;
    public selectedLotWhiteSimCardAvailable: Array<Object> = [];
    public fileModel = 'src/assets/data/Modele-Importation-Sim.xlsx';
    public excelFileIsCorrect: boolean = false;
    public currentArrayHeaders = [
        'MSISDN *',
        'IMSI *',
        'ICCID *',
        'APN *',
        'FORMULE *',
        'STATUT *',
        'USAGE',
        "TYPE D'EMPLACEMENT",
        'NOM CLIENT',
    ] as const;
    public formMasseLibelle = {
        etape_1: 'Etape 1 : Cliquez pour télécharger le fichier modèle',
        etape_2: 'Etape 2 : Importez le fichier renseigné',
        etape_3: 'Etape 3 : Vérifiez la cohérence du fichier importé',
    } as const;
    public libelleFile = {
        file1: 'Télécharger le modèle',
        file2: 'Charger le fichier',
    } as const;
    public readonly table_simple_demand: TableConfig = TABLE_FORM_SIMPLE_DEMAND;
    public readonly table_mass_demand: TableConfig = TABLE_FORM_MASS_DEMAND;

    private destroy$ = new Subject<void>();

    constructor(
        private sharedService: SharedService,
        private toastrService: ToastrService,
        private fb: FormBuilder,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private translate: TranslateService,
        private formDemandApiService: FormDemandApiService,
        private clipboardService: ClipboardService,
        private loadingBarService: LoadingBarService,
        private secondLevelService: SecondLevelService,
        private encodingService: EncodingDataService,
        private supervisionOperationService: SupervisionOperationService
    ) {}

    ngOnInit(): void {
        const user = this.encodingService.getData(
            'user_data'
        ) as CurrentUser | null;
        console.log('user', user);

        this.firstLevelLibel = user?.structure_organisationnelle?.niveau_1;
        this.secondLevelLibel = user?.structure_organisationnelle?.niveau_2;
        this.thirdLevelLibel = user?.structure_organisationnelle?.niveau_3;
        this.activatedRoute.queryParams.subscribe((params: Object) => {
            this.urlParamId = params?.['id'];
            this.urlParamRef = params?.['ref'];
            this.urlParamTypeDemand = params?.['operation'];
        });
        this.getParamsInUrl();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private getParamsInUrl(): void {
        if (
            !isTypeView(this.urlParamRef) ||
            !Object.values(OperationTransaction).includes(
                this.urlParamTypeDemand as OperationTransaction
            )
        ) {
            this.displayUrlErrorPage = true;
        } else {
            this.getTitle;
            this.initFormDemand();
            this.sharedService.fetchWhiteSimCardAvailable();
            if (this.urlParamRef === 'mass-add-importation') return;
            this.sharedService.fetchDemandPrice(
                this.getTypeDemand(this.urlParamTypeDemand)
            );
            this.sharedService.getDemandPrice().subscribe((value) => {
                this.demandPrice = value;
                console.log('demandPrice', this.demandPrice);
            });
            this.sharedService.fetchUsages();
            this.listUsages$ = this.sharedService.getUsages();
            this.sharedService.fetchFormulas();
            this.listFormulas$ = this.sharedService.getFormulas();
            this.sharedService.fetchFirstLevel();
            this.listFirstLevel$ = this.sharedService.getFirstLevel();
            this.sharedService.fetchThirdLevel();
            this.listThirdLevel$ = this.sharedService.getThirdLevel();
        }
    }

    public isNumber(value: unknown): value is number {
        return typeof value === 'number' && !isNaN(value);
    }

    public initFormDemand(): void {
        this.formDemand = this.fb.group<IFormDemandValues>({
            source: new FormControl<string>('stock orange', {
                nonNullable: true,
            }),
            operation: new FormControl<string>(this.urlParamTypeDemand, {
                nonNullable: true,
            }),
            niveau_un_uuid: new FormControl<string>('', { nonNullable: true }),
            niveau_deux_uuid: new FormControl<string>('', {
                nonNullable: true,
            }),
            niveau_trois_uuid: new FormControl<string>('', {
                nonNullable: true,
            }),
            usage_id: new FormControl<string | null>(null, {
                nonNullable: true,
            }),
            nb_demandes: new FormControl<number>(0, {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.min(1),
                    Validators.pattern(/^\d+(\.\d{1,2})?$/),
                ],
            }),
            point_emplacement: new FormControl<string>('', {
                nonNullable: true,
            }),
            adresse_geographique: new FormControl<string>('', {
                nonNullable: true,
            }),
            adresse_email: new FormControl<string>('', {
                validators: Validators.email,
                nonNullable: true,
            }),
            longitude: new FormControl<string>('', { nonNullable: true }),
            latitude: new FormControl<string>('', { nonNullable: true }),
            formule_uuid: new FormControl<string | null>(null, {
                validators: Validators.required,
                nonNullable: true,
            }),
            description: new FormControl<string>('', {
                validators: Validators.required,
                nonNullable: true,
            }),
            montant: new FormControl<number>(0, { nonNullable: true }),
            justificatif: new FormControl<File | null>(null, {
                validators: Validators.required,
                nonNullable: true,
            }),
            sims_file: new FormControl<File | null>(null, {
                nonNullable: true,
            }),
            confirmation_contrat: new FormControl<boolean | null>(null, {
                nonNullable: true,
            }),
        });

        const firstLevelControl = this.formDemand.get('niveau_un_uuid');
        const gererValidatioFirstLevel = (value: string) => {
            this.listSecondLevel$ = this.secondLevelService.getSecondLevel(
                value,
                this.listFirstLevel$
            );
        };
        gererValidatioFirstLevel(firstLevelControl?.value as string);
        firstLevelControl?.valueChanges.subscribe((value: string) => {
            this.listSecondLevel$ = this.secondLevelService.getSecondLevel(
                value,
                this.listFirstLevel$
            );
        });

        // Récupération des contrôles
        const pointEmplacementControl =
            this.formDemand.get('point_emplacement');
        const nbDemandControl = this.formDemand.get('nb_demandes');
        const montantControl = this.formDemand.get('montant');
        const sourceControl = this.formDemand.get('source');

        montantControl?.disable();

        // Fonction pour gérer le montant
        const gererMontantDemandes = (value: number) => {
            if (this.demandPrice) {
                montantControl?.setValue(value * this.demandPrice);
                montantControl?.updateValueAndValidity();
            }
        };

        gererMontantDemandes(nbDemandControl?.value || 0);

        nbDemandControl?.valueChanges
            .pipe(distinctUntilChanged())
            .subscribe((value) => {
                gererMontantDemandes(value);
            });

        sourceControl?.valueChanges
            .pipe(distinctUntilChanged())
            .subscribe((value) => {
                if (value === 'stock local') {
                    nbDemandControl?.disable();
                    nbDemandControl?.reset();
                } else {
                    if (this.urlParamRef === 'simple-add-mobile-subscription') {
                        pointEmplacementControl?.setValidators(
                            Validators.required
                        );
                        nbDemandControl?.setValue(1);
                        nbDemandControl?.disable();
                    } else {
                        nbDemandControl?.enable();
                        nbDemandControl?.reset();
                    }
                    pointEmplacementControl?.updateValueAndValidity();
                }
            });
        if (this.urlParamRef === 'simple-add-mobile-subscription') {
            pointEmplacementControl?.setValidators(Validators.required);
            nbDemandControl?.setValue(1);
            nbDemandControl?.disable();
        }
        const usageControl = this.formDemand.get('usage_id');
        const formuleControl = this.formDemand.get('formule_uuid');
        const simsFileControl = this.formDemand.get('sims_file');
        const confirmationContrat = this.formDemand.get('confirmation_contrat');
        const justificatifContrat = this.formDemand.get('justificatif');
        if (this.urlParamRef.includes('white-sim')) {
            formuleControl?.clearValidators();
            usageControl?.clearValidators();
        }
        if (this.urlParamRef.includes('importation')) {
            simsFileControl?.setValidators(Validators.required);
            confirmationContrat?.setValidators(Validators.required);
            formuleControl?.clearValidators();
            justificatifContrat?.clearValidators();
            nbDemandControl?.setValue(1);
        }
    }

    public pushCurrentArrayForm(file_upload: any) {
        if (file_upload) {
            this.formDemand.get('sims_file')?.patchValue(file_upload.sims_file);
            this.formDemand
                .get('nb_demandes')
                ?.setValue(file_upload.numberLineInExcelFile);
        }
    }

    async onDownloadModel(event: any): Promise<any> {
        const token = this.encodingService.getData(
            'token_data'
        ) as TokenInterface | null;
        console.log(
            'token',
            this.supervisionOperationService.GetSupervisionOperationsTraitementsSuivisDownloadModeleData(
                OperationTransaction.IMPORTATION,
                '',
                token?.value
            )
        );

        window.location.href =
            this.supervisionOperationService.GetSupervisionOperationsTraitementsSuivisDownloadModeleData(
                OperationTransaction.IMPORTATION,
                '',
                token?.value
            );
    }

    async fetchSecondLevel(uuid: string): Promise<void> {
        this.listSecondLevel$ = await this.secondLevelService.getSecondLevel(
            uuid,
            this.listFirstLevel$
        );
    }

    public onChangeFile(file: FileList) {
        const selectedFile = file.item(0);
        this.formDemand.patchValue({ justificatif: selectedFile });
    }

    async handleSaveDemand(): Promise<void> {
        if (this.verifyHandleSaveDemand) {
            const result = await Swal.mixin({
                customClass: SWALWITHBOOTSTRAPBUTTONSPARAMS.customClass,
            }).fire({
                ...SWALWITHBOOTSTRAPBUTTONSPARAMS.message,
                html: this.messageHandleSaveDemand,
            });
            if (result.isConfirmed) {
                this.fetchSaveDemand();
            }
        }
    }

    private async fetchSaveDemand(): Promise<void> {
        const SOMETHING_WENT_WRONG = this.translate.instant(
            'SOMETHING_WENT_WRONG'
        );
        if (this.urlParamRef.includes('importation')) {
            // je desactive par ce que je ne veux pas l'envoyer dans le payload
            this.formDemand.get('nb_demandes')?.disable();
            this.formDemand.get('source')?.disable();
            try {
                const response: any = await handle(
                    () =>
                        this.formDemandApiService.SaveImportation(
                            formDataBuilder({
                                ...this.formDemand.value,
                                operation: OperationTransaction.IMPORTATION,
                            })
                        ),
                    this.toastrService,
                    this.loadingBarService
                );
                this.formDemand.get('nb_demandes')?.enable();
                this.formDemand.get('source')?.enable();
                if (response.error === false) {
                    this.sharedService.fetchDemandsImported({});
                    this.onGoToBack();
                } else {
                    this.toastrService.error(SOMETHING_WENT_WRONG);
                }
            } catch (error) {
                this.excelFileIsCorrect = true;
                console.log('response11111', error);
            }
        } else if (
            this.urlParamRef.includes('white-sim') ||
            this.urlParamRef.includes('mobile-subscription')
        ) {
            const response: any = await handle(
                () =>
                    this.formDemandApiService.SaveDemand(
                        formDataBuilder({
                            ...this.formDemand.value,
                            nb_demandes:
                                this.formDemand.get('nb_demandes')?.value,
                            stockages: JSON.stringify([
                                ...this.globalWhiteSimCardEditRow,
                            ]),
                        })
                    ),
                this.toastrService,
                this.loadingBarService
            );

            if (response.error === false) {
                this.sharedService.fetchDemands({
                    operation: this.urlParamTypeDemand.includes(
                        OperationTransaction.ACTIVATION
                    )
                        ? OperationTransaction.ACTIVATION
                        : 'sim-blanche',
                });
                this.onGoToBack();
            } else {
                this.toastrService.error(SOMETHING_WENT_WRONG);
            }
        }
    }

    private getTypeDemand(urlParamTypeDemand: T_OPERATION): T_OPERATION {
        if (urlParamTypeDemand.includes(OperationTransaction.ACTIVATION)) {
            return OperationTransaction.ACTIVATION;
        } else if (
            urlParamTypeDemand.includes(OperationTransaction.SIM_BLANCHE)
        ) {
            return OperationTransaction.SIM_BLANCHE;
        } else {
            return OperationTransaction.ACTIVATION;
        }
    }

    private get messageHandleSaveDemand(): string {
        const MASS_DEMAND = this.translate.instant('MASS_DEMAND');
        const MASS_IMPORTATION = this.translate.instant('MASS_IMPORTATION');
        const CONFIRM_THE_IMPORTATION_FOR = this.translate.instant(
            'CONFIRM_THE_IMPORTATION_FOR'
        );
        const SIMPLE_DEMAND = this.translate.instant('SIMPLE_DEMAND');
        const CONFIRM_THE_REQUEST_FOR = this.translate.instant(
            'CONFIRM_THE_REQUEST_FOR'
        );
        const SIM_CARD = this.translate.instant('SIM_CARD');
        if (this.urlParamRef.includes('simple-add')) {
            return `${SIMPLE_DEMAND} : <span style="color: #569C5B;">${CONFIRM_THE_REQUEST_FOR} </span><span style="color: #ff6600;"><strong>1</strong></span> ${SIM_CARD}`;
        } else if (
            this.urlParamRef.includes('mass-add') &&
            this.formDemand.get('nb_demandes')?.value
        ) {
            if (this.urlParamRef.includes('importation')) {
                return `${MASS_IMPORTATION} : <span style="color: #569C5B;">${CONFIRM_THE_IMPORTATION_FOR} </span><span style="color: #ff6600;"><strong>${
                    this.formDemand.get('nb_demandes')?.value
                }</strong></span> ${SIM_CARD}`;
            } else {
                return `${MASS_DEMAND} : <span style="color: #569C5B;">${CONFIRM_THE_REQUEST_FOR} </span><span style="color: #ff6600;"><strong>${
                    this.formDemand.get('nb_demandes')?.value
                }</strong></span> ${SIM_CARD}`;
            }
        }
        return '';
    }

    get verifyHandleSaveDemand(): boolean {
        console.log(
            "this.formDemand.get('nb_demandes')?.value",
            this.formDemand.value
        );
        console.log('IS VALID', this.formDemand.valid);

        const SOMETHING_WENT_WRONG = this.translate.instant(
            'SOMETHING_WENT_WRONG'
        );
        const PLEASE_TAKE_BATCH = this.translate.instant('PLEASE_TAKE_BATCH');

        if (this.formDemand.valid && this.urlParamRef.includes('simple-add')) {
            this.formDemand.get('nb_demandes')?.setValue(1);
            return true;
        }

        if (
            this.formDemand.valid &&
            this.urlParamRef.includes('mass-add') &&
            this.formDemand.get('nb_demandes')?.value
        ) {
            return true;
        }

        if (
            this.urlParamRef.includes('mass-add') &&
            !this.formDemand.get('nb_demandes')?.value &&
            this.formDemand.get('source')?.value == 'stock local'
        ) {
            this.toastrService.error(PLEASE_TAKE_BATCH);
            return false;
        }

        this.toastrService.error(SOMETHING_WENT_WRONG);
        return false;
    }

    showDialog() {
        this.whiteSimCardDialogVisible = true;
        this.sharedService.getWhiteSimCardAvailable().subscribe((value) => {
            this.listWhiteSimCardAvailable = value;
        });
        this.sharedService
            .getTotalLotWhiteSimCardAvailable()
            .subscribe((value) => {
                this.totalLotWhiteSimCardAvailable = value;
            });
    }

    public HandleSaveLotWhiteSimCardSelected() {
        if (this.totalWhiteSimCardSelected > 0) {
            const message = `<span style="color: #569C5B;">${this.totalWhiteSimCardSelected}</span> sera prise dans ce lot`;
            Swal.mixin({
                customClass: SWALWITHBOOTSTRAPBUTTONSPARAMS.customClass,
            })
                .fire({
                    ...SWALWITHBOOTSTRAPBUTTONSPARAMS.message,
                    html: message,
                })
                .then((result): void => {
                    if (result.value) {
                        this.whiteSimCardDialogVisible = false;
                        this.formDemand
                            .get('nb_demandes')
                            ?.patchValue(this.totalWhiteSimCardSelected);
                    }
                });
        } else {
            const SOMETHING_WENT_WRONG = this.translate.instant(
                'SOMETHING_WENT_WRONG'
            );
            this.toastrService.warning(SOMETHING_WENT_WRONG);
        }
    }

    /*************************************************Modal => traitement de la lste des cartes SIM disponibles***********************************************/

    expandAll() {
        this.expandedRows = this.listWhiteSimCardAvailable.reduce(
            (acc, p) => (acc[p.id] = true) && acc,
            {}
        );
    }

    collapseAll() {
        this.expandedRows = {};
    }

    editRow(item: any, rowIndex: number): void {
        this.initialRowValue = item.selected_nb_restants;
        this.editableRowIndex = rowIndex;
        this.clonedWhiteSimCard[item.id] = { ...item };
    }

    saveRowEdit(WhiteSimCard: any): void {
        const originalWhiteSimCard = this.clonedWhiteSimCard[WhiteSimCard.id];

        const updatedData = {
            carton_id: originalWhiteSimCard.id,
            quantite:
                WhiteSimCard.selected_nb_restants ??
                originalWhiteSimCard.selected_nb_restants,
        };

        const existsInEditRow = this.globalWhiteSimCardEditRow.some(
            (row) => row.carton_id === updatedData.carton_id
        );

        if (!existsInEditRow) {
            this.globalWhiteSimCardEditRow.push(updatedData);
            const EDIT_SUCCESSFULLY_ADDED = this.translate.instant(
                'EDIT_SUCCESSFULLY_ADDED'
            );
            this.toastrService.success(EDIT_SUCCESSFULLY_ADDED);
        } else {
            const index = this.globalWhiteSimCardEditRow.findIndex(
                (row) => row.carton_id === updatedData.carton_id
            );
            this.globalWhiteSimCardEditRow[index] = updatedData;
            const UPDATED_CHANGE = this.translate.instant('UPDATED_CHANGE');
            this.toastrService.info(UPDATED_CHANGE);
        }

        delete this.clonedWhiteSimCard[WhiteSimCard.id]; // Supprime la sauvegarde temporaire
        this.totalWhiteSimCardSelected = this.globalWhiteSimCardEditRow.reduce(
            (sum, item) => sum + item.quantite,
            0
        );
        this.editableRowIndex = null;
    }

    cancelRowEdit(customer: any, rowIndex: number): void {
        customer.selected_nb_restants = this.initialRowValue;
        this.listWhiteSimCardAvailable[rowIndex] =
            this.clonedWhiteSimCard[customer.id];
        delete this.clonedWhiteSimCard[customer.id];

        // Supprime la ligne de la liste des modifications globales
        this.globalWhiteSimCardEditRow = this.globalWhiteSimCardEditRow.filter(
            (row) => row.carton_id !== customer.id
        );
        this.editableRowIndex = null;
        // this.totalWhiteSimCardSelected = this.globalWhiteSimCardEditRow.reduce((sum, item) => sum + item.quantite, 0);
    }

    public copyToClipboard(data: string): void {
        const translatedMessage = this.translate.instant(
            'COPIED_TO_THE_CLIPBOARD'
        );
        this.toastrService.success(translatedMessage);
        this.clipboardService.copyFromContent(data);
    }

    public onGoToBack(): void {
        this.router.navigateByUrl(
            `/${this.getTitle.moduleRoute}/${this.getTitle.subModuleRoute}`
        );
    }

    get getTitle(): {
        module: string;
        moduleRoute: string;
        subModule: string;
        subModuleRoute: string;
    } {
        switch (this.urlParamRef) {
            case 'mass-add-mobile-subscription':
                return {
                    module: 'REQUESTS_SERVICES',
                    moduleRoute: REQUESTS_SERVICES,
                    subModule: 'MOBILE_SUBSCRIPTIONS',
                    subModuleRoute: MOBILE_SUBSCRIPTIONS,
                };
            case 'simple-add-mobile-subscription':
                return {
                    module: 'REQUESTS_SERVICES',
                    moduleRoute: REQUESTS_SERVICES,
                    subModule: 'MOBILE_SUBSCRIPTIONS',
                    subModuleRoute: MOBILE_SUBSCRIPTIONS,
                };
            // case 'mass-add-importation':
            //     return {
            //         module: 'REQUESTS_SERVICES',
            //         moduleRoute: REQUESTS_SERVICES,
            //         subModule: 'SIM_IMPORTATION',
            //         subModuleRoute: SIM_IMPORTATION,
            //     };
            // case 'simple-add-importation':
            //     return {
            //         module: 'REQUESTS_SERVICES',
            //         moduleRoute: REQUESTS_SERVICES,
            //         subModule: 'SIM_IMPORTATION',
            //         subModuleRoute: SIM_IMPORTATION,
            //     };
            case 'mass-add-importation':
                return {
                    module: 'PATRIMONY',
                    moduleRoute: PATRIMONY,
                    subModule: 'SIM_IMPORTATION',
                    subModuleRoute: SIM_IMPORTATION,
                };
            case 'simple-add-importation':
                return {
                    module: 'PATRIMONY',
                    moduleRoute: PATRIMONY,
                    subModule: 'SIM_IMPORTATION',
                    subModuleRoute: SIM_IMPORTATION,
                };
            case 'mass-add-white-sim':
                return {
                    module: 'REQUESTS_PRODUCTS',
                    moduleRoute: REQUESTS_PRODUCTS,
                    subModule: 'WHITE_SIM',
                    subModuleRoute: 'white-sim',
                };
            default:
                return {
                    module: '',
                    moduleRoute: '',
                    subModule: '',
                    subModuleRoute: '',
                };
        }
    }
}
