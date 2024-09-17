import { DEMANDE_ACTIVATION } from 'src/presentation/pages/demandes/demandes-routing.module';
import { OperationTransaction } from '../../../../../shared/enum/OperationTransaction.enum';
import {
    formDataBuilder,
    formDataBuilderSome,
} from '../../../../../shared/constants/formDataBuilder.constant';
import { ToastrService } from 'ngx-toastr';
import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    OnDestroy,
    ViewChild,
} from '@angular/core';
import { SimStatut } from 'src/shared/enum/SimStatut.enum';
import { HttpClient } from '@angular/common/http';
import { EndPointUrl } from '../../data-access/api.enum';

import { environment } from 'src/environments/environment.prod';
import { SettingService } from 'src/shared/services/setting.service';
import { MappingService } from 'src/shared/services/mapping.service';
import { EncodingDataService } from 'src/shared/services/encoding-data.service';
import { ApplicationType } from 'src/shared/enum/ApplicationType.enum';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StatutTransaction } from 'src/shared/enum/StatutTransaction.enum';
import { TraitementTransaction } from 'src/shared/enum/TraitementTransaction.enum';
import { PatrimoineService } from 'src/presentation/pages/patrimoine/data-access/patrimoine.service';
import { Router } from '@angular/router';
import { DEMANDE_SERVICE } from 'src/shared/routes/routes';
import { DemandeService } from '../../data-access/demande.service';

@Component({
    selector: 'app-transaction-form',
    templateUrl: './transaction-form.component.html',
    styleUrls: ['./transaction-form.component.scss'],
})
export class TransactionFormComponent implements OnInit, OnDestroy {
    public fileModel =
        '../../../../../assets/data/Modele-Activation-En-Masse.xlsx';
    public baseUrl: string;
    @Output() listSuspensions = new EventEmitter();
    @Input() currentObject;
    @Input() currentSelectedActionValue;
    @Input() typeDemande;
    @Output() formsView = new EventEmitter();
    @Output() listTransactions = new EventEmitter();
    public adminForm: FormGroup;
    public selectedValue: string;
    public listPatrimoineSims: Array<any> = [];
    public totalPageArray: Array<any> = [];
    public currentListSims: Array<any> = [];
    public listFormules: Array<any> = [];
    public currentPatrimoine: any = {};
    public selectedVolume: any;
    public display: boolean = false;
    public isMaximized: boolean = false;
    public selectedActionValue: string;
    public radioValue: string = 'IMSI';
    public operationValue: string;
    public totalPage: 0;
    public totalRecords: 0;
    public recordsPerPage: 0;
    public offset: any;
    public p: number = 1;
    public currentListSimsPage: number;
    public siteKey: string;
    public currentRecaptcha: string;
    //Operations Transaction
    public activation: string = OperationTransaction.ACTIVATION;
    public activationMasse: string = OperationTransaction.ACTIVATION_EN_MASSE;
    public suspension: string = OperationTransaction.SUSPENSION;
    public formule: string = OperationTransaction.CHANGEMENT_FORMULE;
    public resiliation: string = OperationTransaction.RESILIATION;
    public swap: string = OperationTransaction.SWAP;
    public volume: string = OperationTransaction.VOLUME_DATA;

    //FormsControl
    public listDirections: Array<any> = [];
    public listExploitations: Array<any> = [];
    public listUsages: Array<any> = [];
    public listActivites: Array<any> = [];
    public currentArrayHeaders: Array<any> = [];
    public listDemandes: any;
    public selectedImsi: string;
    public selectedDescription: string;
    public selectedPiece: any;
    public selectedFormule: any;
    public selectedMsisdn: string;
    public selectedDirection: any;
    public selectedExploitation: any;
    public patrimoineType: string;
    public historie: any;
    @ViewChild('captchaElem', { static: false }) captchaElem: any;
    //Type Source
    public sourceStock: string = 'stock';
    public sourceOrange: string = 'orangeci';
    public sourceValue: string;

    //Mapping
    public applicationType: string;
    public firstLevelLibelle: string;
    public secondLevelLibelle: string;
    public thirdLevelLibelle: string;
    public sourceStockTenantSim: string;
    public sourceStockOrangeSim: string;
    public sourceSoldeDotation: string;
    public sourceSoldeDotationOrange: string;

    constructor(
        private patrimoineService: PatrimoineService,
        private demandeService: DemandeService,
        private settingService: SettingService,
        private toastrService: ToastrService,
        private httpClient: HttpClient,
        private router: Router,
        private mappingService: MappingService,
        private storage: EncodingDataService,
        private fb: FormBuilder
    ) {
        const data = JSON.parse(this.storage.getData('user'));
        this.baseUrl = `${data?.tenant?.url_backend}/api/v1/`;
        this.firstLevelLibelle = this.mappingService.structureGlobale?.niveau_1;
        this.secondLevelLibelle =
            this.mappingService.structureGlobale?.niveau_2;
        this.thirdLevelLibelle = this.mappingService.structureGlobale?.niveau_3;
        (this.sourceStockTenantSim = this.mappingService.sourceStockTenantSim),
            (this.sourceStockOrangeSim =
                this.mappingService.sourceStockOrangeSim),
            (this.sourceSoldeDotation =
                this.mappingService?.sourceSoldeDotation);
        this.sourceSoldeDotationOrange =
            this.mappingService?.sourceSoldeDotationOrange;
        this.applicationType = this.mappingService.applicationType;
        this.patrimoineType = ApplicationType.PATRIMOINESIM;
    }

    ngOnInit() {
        this.siteKey = environment.recaptcha.siteKey;
        this.isFilter();
        if (this.typeDemande === "simple") {
            this.initFormSimple();
        } else if(this.typeDemande === "masse") {
            this.initFormMasse();
        }
        this.IsFormFomSIMValidate();
        this.isVerify();
        this.IsPatrimoineType();
        this.GetAllFormules();
        this.historie = history.state.patrimoine;
        this.onGetDrValueChanges();
        if (this.historie) {
            this.selectedActionValue = history.state.operation;
            this.operationValue = this.selectedActionValue;
            this.currentPatrimoine = history.state.patrimoine;
            this.onFormPachValues();
            this.adminForm.get('imsi').disable();
            this.adminForm.get('msisdn').disable();
        } else {
            this.selectedActionValue = this.currentSelectedActionValue;
            this.operationValue = this.selectedActionValue;
        }
        if (this.selectedActionValue === OperationTransaction.ACTIVATION) {
            this.getAllDirectionRegionales();
            this.getAllUsages();
            this.getAllZones();
        }
        if (this.selectedActionValue === this.swap) {
            this.sourceValue = 'stock';
        }
        if (this.applicationType === ApplicationType.MONITORING) {
            this.sourceValue = this.sourceOrange;
        }
        if (
            this.selectedActionValue === 'activation' &&
            this.typeDemande === 'masse'
        ) {
            this.selectedActionValue = 'activation-en-masse';
        }
        if (this.typeDemande === 'masse') {
            this.currentArrayHeaders = [
                'TYPE_EMPLACEMENT',
                'NOM_EMPLACEMENT',
                'USAGE',
                'ADRESSE_MAIL',
                'ADRESSE_GEOGRAPHIQUE',
                'LATITUDE',
                'LONGITUDE',
                'MSISDN',
                'IMSI',
            ];
        }
    }

    pushCurrentArrayForm(event) {
        this.listDemandes = event;
    }
    close() {
        history.state.operation = null;
        this.formsView.emit(false);
        this.typeDemande = null;
    }

    IsPatrimoineType(): boolean {
        return this.applicationType === this.patrimoineType ? true : false;
    }

    public initFormMasse(): void {
        this.adminForm = this.fb.group({
            operation: this.activationMasse,
            niveau_un_uuid: [this.currentObject ? this.currentObject.niveau_un_uuid : '', [Validators.required]],
            niveau_deux_uuid: [this.currentObject ? this.currentObject.niveau_deux_uuid : '', [Validators.required]],
            niveau_trois_uuid: [this.currentObject ? this.currentObject.niveau_trois_uuid : '', [Validators.required]],
            usage_id: [this.currentObject ? this.currentObject.usage_id : '', [Validators.required]],
            nb_demandes: [this.currentObject ? this.currentObject.nb_demandes : '', [Validators.required]],
            formule_uuid: [this.currentObject ? this.currentObject.formule_uuid : '', [Validators.required]],
            description: [this.currentObject ? this.currentObject.description : '', [Validators.required]],
            type_paiement: [null, Validators.required],
            recu_paiement: [null],
            justificatif: [null, Validators.required]
        });
        const typePaiementControl = this.adminForm.get("type_paiement");
        const recuPaiementControl = this.adminForm.get("recu_paiement");
        typePaiementControl.valueChanges.subscribe((value) => {
            if (value === "immédiat") {
                recuPaiementControl.setValidators([Validators.required]);
            } else {
                recuPaiementControl.clearValidators();
                recuPaiementControl.reset();
            }
            recuPaiementControl.updateValueAndValidity();
        });
    }

    public initFormSimple(): void {
        this.adminForm = this.fb.group({
            operation: this.activation,
            niveau_un_uuid: [this.currentObject ? this.currentObject.niveau_un_uuid : '', [Validators.required]],
            niveau_deux_uuid: [this.currentObject ? this.currentObject.niveau_deux_uuid : '', [Validators.required]],
            niveau_trois_uuid: [this.currentObject ? this.currentObject.niveau_trois_uuid : '', [Validators.required]],
            usage_id: [this.currentObject ? this.currentObject.usage_id : '', [Validators.required]],
            nb_demandes: [this.currentObject ? this.currentObject.nb_demandes : '', [Validators.required]],
            point_emplacement: [this.currentObject ? this.currentObject.point_emplacement : '', [Validators.required]],
            adresse_geographique: [this.currentObject ? this.currentObject.adresse_geographique : '', [Validators.required],],
            longitude: [this.currentObject ? this.currentObject.longitude : ''],
            latitude: [this.currentObject ? this.currentObject.latitude : ''],
            adresse_email: [null, Validators.email],
            imsi: [null ,Validators.pattern("^[0-9]*$"), Validators.maxLength(15), Validators.minLength(15)],
            statut: [''],
            statut_contrat: [''],
            formule_uuid: [this.currentObject ? this.currentObject.formule_uuid : '', [Validators.required]],
            description: [this.currentObject ? this.currentObject.description : '', [Validators.required]],
            msisdn: [null, Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(10)],
            code_pin: [''],
            username: [''],
            site: [''],
            adresse_ip: [''],
            proxy: [''],
            type_paiement: [null, Validators.required],
            recu_paiement: [null],
            justificatif: [null, Validators.required]
        });
        const typePaiementControl = this.adminForm.get("type_paiement");
        const recuPaiementControl = this.adminForm.get("recu_paiement");
        const msisdnControl = this.adminForm.get("msisdn");
        const imsiControl = this.adminForm.get("imsi");
        typePaiementControl.valueChanges.subscribe((value) => {
            if (value === "immédiat") {
                recuPaiementControl.setValidators([Validators.required]);
            } else {
                recuPaiementControl.clearValidators();
                recuPaiementControl.reset();
            }
            recuPaiementControl.updateValueAndValidity();
        });
        msisdnControl.valueChanges.subscribe((value) => {
          if (value && value.length > 10) {
            msisdnControl.setValue(value.slice(0, 10), { emitEvent: false });
          }
        });
        imsiControl.valueChanges.subscribe((value) => {
          if (value && value.length > 15) {
            imsiControl.setValue(value.slice(0, 15), { emitEvent: false });
          }
        });
    }

    get statut_contrat() {
        return this.adminForm.get('statut').value;
    }

    public GetAllTransactions() {
        this.demandeService
            .GetDemandeServiceByTransaction(
                {
                    operation: this.currentSelectedActionValue,
                },
                1
            )
            .subscribe({
                next: (response) => {
                    const datas = response['data']['data'].map((data) => {
                        if (data?.statut === StatutTransaction.TARITER) {
                            return {
                                ...data,
                                current_date: data?.date_traitement,
                            };
                        } else if (
                            data?.statut === StatutTransaction.CLOTURER
                        ) {
                            return {
                                ...data,
                                current_date: data?.date_cloture,
                            };
                        } else if (
                            data?.statut === StatutTransaction.SOUMIS &&
                            data?.traitement === TraitementTransaction.ACQUITER
                        ) {
                            return {
                                ...data,
                                current_date: data?.date_acquittement,
                            };
                        } else {
                            return { ...data, current_date: 'N/A' };
                        }
                    });
                    this.listTransactions.emit(datas);
                    this.totalPage = response.data.last_page;
                    this.totalRecords = response.data.total;
                    this.recordsPerPage = response.data.per_page;
                    this.offset =
                        (response.data.current_page - 1) * this.recordsPerPage +
                        1;
                    this.close();
                },
                error: (error) => {
                    this.toastrService.error(error.error.message);
                },
            });
    }
    public GetAllPatrimoines() {
        this.patrimoineService.GetAllPatrimoines({}, this.p).subscribe({
            next: (response) => {
                this.listPatrimoineSims = response.data.data;
                this.totalPage = response.data.last_page;
                this.totalRecords = response.data.total;
                this.recordsPerPage = response.data.per_page;
                this.offset =
                    (response.data.current_page - 1) * this.recordsPerPage + 1;
                for (let i = 0; i < this.totalPage; i++) {
                    this.totalPageArray.push(i);
                }
            },
            error: (error) => {
                this.toastrService.error(error.error.message);
            },
        });
    }

    public formatTitle(title: string) {
        switch (title) {
            case OperationTransaction.ACHAT_SERVICE: {
                return 'Achat de Services';
            }
            case 'activation-en-masse': {
                return 'Abonnement en masse de SIM';
            }
            case OperationTransaction.ACTIVATION: {
                return 'Activation de SIM';
            }
            case OperationTransaction.SWAP: {
                return 'Changement de carte SIM';
            }
            case OperationTransaction.SUSPENSION: {
                return 'Suspension de SIM';
            }
            case OperationTransaction.RESILIATION: {
                return 'Résiliation de SIM';
            }
            case OperationTransaction.VOLUME_DATA: {
                return 'Depot de volume	';
            }
            case 'provisionning': {
                return 'Ligne de Credit';
            }
            case OperationTransaction.CHANGEMENT_FORMULE: {
                return 'Changement de formule';
            }
            default:
                return 'N/A';
        }
    }
    public getAllDirectionRegionales() {
        this.settingService.GetAllFirstLevelSimple({}).subscribe({
            next: (response) => {
                this.listDirections = response.data;
            },
            error: (error) => {
                this.toastrService.error(error.error.message);
            },
        });
    }

    onGetDrValueChanges() {
        return this.adminForm
            .get('niveau_un_uuid')
            .valueChanges.subscribe((value) => {
                this.getAllExploitation(value);
            });
    }
    public getAllExploitation(data: string) {
        this.settingService
            .GetAllSecondLevelSimple({
                niveau_un_uuid: data,
            })
            .subscribe(
                (response: any) => {
                    this.listExploitations = response['data'];
                },
                (error) => {
                    this.toastrService.error(error.error.message);
                }
            );
    }
    public getAllUsages() {
        this.patrimoineService.GetAllUsages({}).subscribe({
            next: (response) => {
                this.listUsages = response['data'];
            },
            error: (error) => {
                this.toastrService.error(error.error.message);
            },
        });
    }
    public getAllZones(): void {
        this.settingService.GetAllThirdSimple({}).subscribe({
            next: (response) => {
                this.listActivites = response['data'];
            },
            error: (error) => {
                this.toastrService.error(error.error.message);
            },
        });
    }
    public GetAllFormules(): void {
        this.settingService.GetAllFormules({}).subscribe({
            next: (response) => {
                this.listFormules = response['data'];
            },
            error: (error) => {
                this.toastrService.error(error.error.message);
            },
        });
    }
    public onVerify() {
        this.patrimoineService
            .OnVerify({
                ...(this.radioValue === 'IMSI'
                    ? { imsi: this.selectedValue }
                    : { msisdn: this.selectedValue }),
            })
            .subscribe({
                next: (response: any) => {
                    this.currentPatrimoine = response['data'];
                },
                error: (error) => {
                    this.toastrService.error(error.error.message);
                    // this.currentPatrimoine = {}
                },
            });
    }
    public changeItem(event: any) {
        this.currentPatrimoine = {};
        this.selectedValue = null;
        this.selectedVolume = null;
        this.selectedDescription = null;
    }
    public onChangeFile(file: FileList, type: "justificatif"|"recu-paiement") {
        switch (type) {
            case "justificatif" : this.adminForm.patchValue({justificatif : file.item(0)}); break;
        
            case "recu-paiement" : this.adminForm.patchValue({recu_paiement : file.item(0)}) ; break;
        }
    }
    public handleSaveNewTransaction() {
        let baseUrl;
        let data;
        if (this.selectedActionValue === OperationTransaction.SWAP) {
            data = formDataBuilder({
                ...this.currentPatrimoine,
                operation: this.selectedActionValue,
                bac_a_pioche: this.sourceValue,
                description: this.selectedDescription,
                justificatif: this.selectedPiece,
            });
            baseUrl = `${this.baseUrl}${EndPointUrl.SWAPER_SIM}`;
        } else if (
            this.selectedActionValue === OperationTransaction.ACTIVATION
        ) {
            let adminData;
            if (this.applicationType === ApplicationType.MONITORING) {
                adminData = {
                    ...(this.historie
                        ? {
                              ...this.adminForm.value,
                              msisdn: this.currentPatrimoine?.msisdn,
                              imsi: this.currentPatrimoine?.imsi,
                          }
                        : this.adminForm.value),
                    bac_a_pioche: 'orangeci',
                };
            } else if (this.applicationType === ApplicationType.PATRIMOINESIM) {
                adminData = {
                    ...this.adminForm.value,
                    ...this.adminForm.value,
                    bac_a_pioche:
                        this.sourceValue !== undefined
                            ? this.sourceValue
                            : 'patrimoine',
                };
            }
            console.log('this.adminForm.value', this.adminForm.value)
            data = formDataBuilder({
                ...adminData,
                operation: this.selectedActionValue,
                justificatif: this.selectedPiece,
            });
            baseUrl = `${this.baseUrl}${EndPointUrl.CHANGE_STATUT}`;
        } else if (
            this.selectedActionValue === OperationTransaction.VOLUME_DATA
        ) {
            data = formDataBuilder({
                ...this.currentPatrimoine,
                operation: this.selectedActionValue,
                description: this.selectedDescription,
                bac_a_pioche: 'stock',
                volume: this.selectedVolume,
                justificatif: this.selectedPiece,
            });
            baseUrl = `${this.baseUrl}${EndPointUrl.VOLUME_DATA}`;
        } else {
            data = formDataBuilder({
                ...this.currentPatrimoine,
                operation: this.selectedActionValue,
                description: this.selectedDescription,
                justificatif: this.selectedPiece,
                formule_uuid: this.selectedFormule,
            });
            baseUrl = this.typeDemande === 'modifier' ? `${this.baseUrl}${EndPointUrl.MODIFICATION_DEMANDE}`: `${this.baseUrl}${EndPointUrl.CHANGE_STATUT}` ;
        }
        this.httpClient.post(`${baseUrl}`, data).subscribe({
            next: (res: any) => {
                this.GetAllTransactions();
                this.toastrService.success(res.message);
            },
            error: (error) => {
                this.toastrService.error(error.error.message);
            },
        });
    }
    public handleSaveMasse() {
        let baseUrl;
        let data;
        if (this.router.url === `/${DEMANDE_SERVICE}/${DEMANDE_ACTIVATION}`) {
            // this.adminForm.patchValue({
            //     niveau_un_uuid: this.adminForm.get('niveau_un_uuid').value,
            //     niveau_deux_uuid: this.adminForm.get('niveau_deux_uuid').value,
            //     niveau_trois_uuid: this.adminForm.get('niveau_trois_uuid').value,
            //     statut_contrat: this.adminForm.get('statut').value,
            //     formule_uuid: this.adminForm.get('formule_uuid').value,
            //     usage_id: this.adminForm.get('usage_id').value,
            //     nb_demandes: this.adminForm.get('nb_demandes').value,
            // });
            console.log('this.adminForm 11111', this.adminForm.value)
            //Disable Our Controls
            // this.adminForm.get('point_emplacement').disable();
            // this.adminForm.get('adresse_geographique').disable();
            // this.adminForm.get('longitude').disable();
            // this.adminForm.get('latitude').disable();
            // this.adminForm.get('adresse_email').disable();
            // this.adminForm.get('imsi').disable();
            // this.adminForm.get('msisdn').disable();
            // this.adminForm.get('code_pin').disable();
            // this.adminForm.get('username').disable();
            // this.adminForm.get('site').disable();
            // this.adminForm.get('statut').disable();
            // this.adminForm.get('statut_contrat').disable();
            // this.adminForm.get('adresse_ip').disable();
            // this.adminForm.get('proxy').disable();
            let adminData;
            if (this.applicationType === ApplicationType.MONITORING) {
                adminData = {
                    ...(this.historie
                        ? this.currentPatrimoine
                        : this.adminForm.value),
                    bac_a_pioche: 'orangeci',
                };
            } else if (this.applicationType === ApplicationType.PATRIMOINESIM) {
                adminData = {
                    ...(this.historie
                        ? this.currentPatrimoine
                        : this.adminForm.value),
                    ...this.adminForm.value,
                    bac_a_pioche:
                        this.sourceValue !== undefined
                            ? this.sourceValue
                            : 'patrimoine',
                };
            }
            console.log('this.adminForm 2222', this.adminForm.value)
            // data = formDataBuilder({
            //     ...adminData,
            //     operation: this.selectedActionValue,
            //     justificatif: this.selectedPiece,
            //     description: this.selectedDescription,
            //     demandes: this.listDemandes,
            // });
            baseUrl = `${this.baseUrl}${EndPointUrl.CHANGE_STATUT}`;
        }
        
        console.log('this.adminForm 3333', this.adminForm.value)
        this.httpClient.post(`${baseUrl}`, formDataBuilder(this.adminForm.value)).subscribe({
            next: (res: any) => {
                this.GetAllTransactions();
                this.toastrService.success(res.message);
            },
            error: (error) => {
                this.toastrService.error(error.error.message);
            },
        });
    }

    public selectedSource(value: string) {
        this.sourceValue = value;
    }

    public hideDialog() {
        setTimeout(() => {
            this.display = false;
        }, 500);
    }

    public onFormPachValues(): void {
        this.adminForm
            .get('niveau_un_uuid')
            .patchValue(this.currentPatrimoine?.niveau_un_uuid);
        this.adminForm
            .get('niveau_deux_uuid')
            .patchValue(this.currentPatrimoine?.niveau_deux_uuid);
        this.adminForm
            .get('niveau_trois_uuid')
            .patchValue(this.currentPatrimoine?.niveau_trois_uuid);
        this.adminForm
            .get('usage_id')
            .patchValue(this.currentPatrimoine?.usage_id);
        this.adminForm.get('imsi').patchValue(this.currentPatrimoine?.imsi);
        this.adminForm.get('msisdn').patchValue(this.currentPatrimoine?.msisdn);
        this.adminForm.get('statut').patchValue(this.currentPatrimoine?.statut);
        this.adminForm
            .get('code_pin')
            .patchValue(this.currentPatrimoine?.code_pin);
        this.adminForm
            .get('adresse_geographique')
            .patchValue(this.currentPatrimoine?.adresse_geographique);
        this.adminForm
            .get('point_emplacement')
            .patchValue(this.currentPatrimoine?.point_emplacement);
        this.adminForm
            .get('adresse_email')
            .patchValue(this.currentPatrimoine?.adresse_email);
        this.adminForm
            .get('longitude')
            .patchValue(this.currentPatrimoine?.longitude);
        this.adminForm
            .get('latitude')
            .patchValue(this.currentPatrimoine?.latitude);
    }
    public isVerify(): boolean {
        return Object.keys(this.currentPatrimoine).length === 0 ? true : false;
    }

    public IsFormFomSIMValidate(): boolean {
        if (this.selectedActionValue === this.volume) {
            return !this.selectedDescription || !this.selectedVolume
                ? true
                : false;
        } else if (this.selectedActionValue === this.formule) {
            return !this.selectedDescription || !this.selectedFormule
                ? true
                : false;
        } else {
            !this.selectedDescription ? true : false;
            return !this.selectedDescription ? true : false;
        }
    }
    public isFilter(): boolean {
        return !this.selectedValue ? true : false;
    }
    getFormattedMsisdn(value): string {
        const msisdn = value || ''; // Assurez-vous que msisdn est défini
        const formattedMsisdn = msisdn.replace(/(\d{2})(?=\d)/g, '$1 '); // Ajoute le séparateur
        return formattedMsisdn;
    }
    ngOnDestroy(): void {
        history.state.patrimoine = null;
        history.state.operation = null;
    }
}
