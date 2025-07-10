import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MappingService } from '../../../../../../shared/services/mapping.service';
import { OperationTransaction } from '../../../../../../shared/enum/OperationTransaction.enum';
import { TypeUtilisateur } from '../../../../../../shared/enum/TypeUtilisateur.enum';
import { ApplicationType } from '../../../../../../shared/enum/ApplicationType.enum';
import { SharedService } from '../../../../../../shared/services/shared.service';
import { combineLatest, Observable, Subject, takeUntil } from 'rxjs';
import * as moment from 'moment';
import { simCardApiService } from '../../../data-access/sim-card/services/sim-card-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoadingBarService } from '@ngx-loading-bar/core';
const Swal = require('sweetalert2');
import { SWALWITHBOOTSTRAPBUTTONSPARAMS } from '../../../../../../shared/constants/swalWithBootstrapButtonsParams.constant';
import { handle } from '../../../../../../shared/functions/api.function';
import { PatrimoineService } from '../../../../patrimoine/data-access/patrimoine.service';
import { SIM_CARD } from '../../../patrimony-routing.module';
import { TranslateService } from '@ngx-translate/core';
import { PATRIMONY } from '../../../../../../shared/routes/routes';
import { AsFeatureService } from '../../../../../../shared/services/as-feature.service';
import { simCardDetailsInterface } from '../../../data-access/sim-card/interfaces/sim-card-details.interface';
import { NatureDocument } from '../../../../../../shared/enum/NatureDocument.enum';
import { NaturePiece } from '../../../../../../shared/enum/NaturePiece.enum';
import { SecondLevelInterface } from '../../../../../../shared/interfaces/first-level.interface';
import { SecondLevelService } from '../../../../../../shared/services/second-level.service';
import { CurrentUser } from '../../../../../../shared/interfaces/current-user.interface';
import { EncodingDataService } from '../../../../../../shared/services/encoding-data.service';

type TYPEVIEW = 'view-sim-card' | 'update-sim-card' | 'identification-sim-card';
const TYPEVIEW_VALUES: TYPEVIEW[] = [
    'view-sim-card',
    'update-sim-card',
    'identification-sim-card',
];
function isTypeView(value: any): value is TYPEVIEW {
    return TYPEVIEW_VALUES.includes(value);
}
@Component({
    selector: 'app-form-sim-card',
    templateUrl: './form-sim-card.component.html',
    styleUrls: ['./form-sim-card.component.scss'],
})
export class FormSimCardComponent implements OnInit, OnDestroy {
    public module: string;
    public subModule: string;
    public urlParamRef: TYPEVIEW;
    public urlParamMSISDN: string;
    public displayUrlErrorPage: boolean = false;

    public formUpdateCarteSim: FormGroup;
    public formIdentifierCarteSim: FormGroup;
    public formDetailsCarteSim: FormGroup;
    public listFirstLevel$: Observable<any[]>;
    public listSecondLevel$: Observable<Array<SecondLevelInterface>>;
    public listThirdLevel$: Observable<any[]>;
    public listUsages$: Observable<any[]>;
    public firstLevelLibel: string | undefined;
    public secondLevelLibel: string | undefined;
    public thirdLevelLibel: string | undefined;

    public filesPhysique = [];
    public filesRecto = [];
    public filesVerso = [];
    public listeTypeUtilisateur: Array<any> = [];
    public listeNaturePiece: Array<any> = [];
    public listeNatureDocument: Array<any> = [];
    public displayPersonne: boolean = false;
    public isNoVerifyPiecesPhotos: boolean = false;

    public simCardSelectedDetails: simCardDetailsInterface;
    public totalSizePercent: number = 0;
    public imageURLs: { [key: string]: string } = {};

    public applicationType: string;
    public patrimoineType: string;
    public TypeUtilisateur = TypeUtilisateur;

    public asAccessFeatureIdentification: boolean;
    public asAccessFeatureDataBalance: boolean;
    public asAccessFeatureSmsBalance: boolean;

    private destroy$ = new Subject<void>();

    constructor(
        private activatedRoute: ActivatedRoute,
        private loadingBar: LoadingBarService,
        private toastrService: ToastrService,
        private fb: FormBuilder,
        private patrimoineService: PatrimoineService,
        public mappingService: MappingService,
        private router: Router,
        private sharedService: SharedService,
        private simCardApiService: simCardApiService,
        private translate: TranslateService,
        private asFeatureService: AsFeatureService,
        private encodingService: EncodingDataService,
        private secondLevelService: SecondLevelService
    ) {
        this.asAccessFeatureIdentification = this.asFeatureService.hasFeature(
            OperationTransaction.IDENTIFICATION
        );
        this.asAccessFeatureDataBalance = this.asFeatureService.hasFeature(
            OperationTransaction.SOLDE_DATA
        );
        this.asAccessFeatureSmsBalance = this.asFeatureService.hasFeature(
            OperationTransaction.SOLDE_SMS
        );

        this.applicationType = this.mappingService.applicationType;
        this.patrimoineType = ApplicationType.PATRIMOINESIM;
        Object.values(TypeUtilisateur).forEach((item) => {
            this.listeTypeUtilisateur.push(item);
        });
        Object.values(NaturePiece).forEach((item) => {
            this.listeNaturePiece.push(item);
        });
        Object.values(NatureDocument).forEach((item) => {
            this.listeNatureDocument.push(item);
        });
    }

    ngOnInit(): void {
        const user = this.encodingService.getData(
            'user_data'
        ) as CurrentUser | null;
        this.firstLevelLibel = user?.structure_organisationnelle?.niveau_1;
        this.secondLevelLibel = user?.structure_organisationnelle?.niveau_2;
        this.thirdLevelLibel = user?.structure_organisationnelle?.niveau_3;
        this.activatedRoute.data.subscribe((data) => {
            this.module = data.module;
            this.subModule = data.subModule[0];
        });
        this.getParamsInUrl();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onSelectedFiles(event, typeFile: 'physique' | 'recto' | 'verso') {
        switch (typeFile) {
            case 'physique':
                this.filesPhysique = event.currentFiles;
                break;

            case 'recto':
                this.filesRecto = event.currentFiles;
                break;

            case 'verso':
                this.filesVerso = event.currentFiles;
        }
    }

    private getParamsInUrl(): void {
        this.activatedRoute.queryParams.subscribe((params: Object) => {
            this.urlParamRef = params?.['ref'];
            this.urlParamMSISDN = params?.['msisdn'];
        });
        const imsi = this.activatedRoute.snapshot.paramMap.get('imsi') ?? '';
        switch (this.urlParamRef) {
            case 'update-sim-card':
                this.initFormUpdateCarteSim();
                break;
            case 'identification-sim-card':
                this.initFormIdentificationCarteSim();
                break;
            case 'view-sim-card':
                this.initFormDetailsCarteSim();
                break;
        }
        if (!isTypeView(this.urlParamRef)) {
            this.displayUrlErrorPage = true;
        } else {
            this.sharedService.fetchFirstLevel();
            this.listFirstLevel$ = this.sharedService.getFirstLevel();
            this.sharedService.fetchThirdLevel();
            this.listThirdLevel$ = this.sharedService.getThirdLevel();
            this.sharedService.fetchUsages();
            this.listUsages$ = this.sharedService.getUsages();
            if (this.urlParamRef === 'view-sim-card')
                this.formDetailsCarteSim.disable();
            this.getCarteSimSelectedDetails(imsi);
        }
    }

    async getCarteSimSelectedDetails(
        simCardSelectedImsi: string
    ): Promise<void> {
        this.simCardApiService.fetchSimCardDetails(simCardSelectedImsi);
        this.simCardApiService.getSimCardDetails().subscribe((value) => {
            this.simCardSelectedDetails = value;
            switch (this.urlParamRef) {
                case 'update-sim-card':
                    this.patchValueFormUpdateCarteSim(
                        this.simCardSelectedDetails
                    );
                    break;
                case 'identification-sim-card':
                    this.patchValueFormIdentifierCarteSim(
                        this.simCardSelectedDetails
                    );
                    break;
                case 'view-sim-card':
                    this.patchValueFormDetailsCarteSim(
                        this.simCardSelectedDetails
                    );
                    break;
            }
        });
    }

    private patchValueFormIdentifierCarteSim(
        simCardSelectedDetails: simCardDetailsInterface
    ): void {
        this.formIdentifierCarteSim.patchValue({
            sim_id: simCardSelectedDetails?.id,
            type_personne: simCardSelectedDetails.type_personne,
            nom: simCardSelectedDetails.nom,
            prenoms: simCardSelectedDetails.prenoms,
            nature_piece: simCardSelectedDetails.nature_piece,
            numero_piece: simCardSelectedDetails.numero_piece,
            imsi: simCardSelectedDetails?.imsi,
            iccid: simCardSelectedDetails?.iccid,
            msisdn: simCardSelectedDetails?.msisdn,
            date_naissance: simCardSelectedDetails?.date_naissance,
            lieu_naissance: simCardSelectedDetails?.lieu_naissance,
        });

        if (simCardSelectedDetails?.photo_carte_recto) {
            this.imageURLs['recto'] =
                simCardSelectedDetails?.photo_carte_recto ?? '';
        }
        if (simCardSelectedDetails?.photo_carte_verso) {
            this.imageURLs['verso'] =
                simCardSelectedDetails?.photo_carte_verso ?? '';
        }
        if (simCardSelectedDetails?.photo_physique) {
            this.imageURLs['physique'] =
                simCardSelectedDetails.photo_physique ?? '';
        }
    }

    private patchValueFormUpdateCarteSim(
        simCardSelectedDetails: simCardDetailsInterface
    ): void {
        this.formUpdateCarteSim.patchValue({
            sim_id: simCardSelectedDetails?.id,
            imsi: simCardSelectedDetails?.imsi,
            iccid: simCardSelectedDetails?.iccid,
            msisdn: simCardSelectedDetails?.msisdn,
            formule: simCardSelectedDetails?.formule,
            niveau_un_uuid: simCardSelectedDetails?.niveau_un_uuid,
            niveau_deux_uuid: simCardSelectedDetails?.niveau_deux_uuid,
            niveau_trois_uuid: simCardSelectedDetails?.niveau_trois_uuid,
            point_emplacement: simCardSelectedDetails?.point_emplacement,
            usage_id: simCardSelectedDetails?.usage_id,
            adresse_email: simCardSelectedDetails?.adresse_email,
            adresse_geographique: simCardSelectedDetails?.adresse_geographique,
            longitude: simCardSelectedDetails?.longitude,
            latitude: simCardSelectedDetails?.latitude,
            date_localisation: simCardSelectedDetails?.date_localisation,
            apn: simCardSelectedDetails?.apn,
            adresse_ip: simCardSelectedDetails?.adresse_ip,
            site_reseau: simCardSelectedDetails?.site_reseau,
        });
    }

    private patchValueFormDetailsCarteSim(
        simCardSelectedDetails: simCardDetailsInterface
    ): void {
        this.formDetailsCarteSim.patchValue({
            sim_id: simCardSelectedDetails?.id,
            type_personne: simCardSelectedDetails?.type_personne,
            nom: simCardSelectedDetails?.nom,
            prenoms: simCardSelectedDetails?.prenoms,
            nature_piece: simCardSelectedDetails?.nature_piece,
            numero_piece: simCardSelectedDetails?.numero_piece,
            imsi: simCardSelectedDetails?.imsi,
            iccid: simCardSelectedDetails?.iccid,
            msisdn: simCardSelectedDetails?.msisdn,
            formule: simCardSelectedDetails?.formule,
            date_naissance: simCardSelectedDetails?.date_naissance,
            lieu_naissance: simCardSelectedDetails?.lieu_naissance,
            niveau_un_uuid: simCardSelectedDetails?.niveau_uns_nom,
            niveau_deux_uuid: simCardSelectedDetails?.niveau_deux_nom,
            niveau_trois_uuid: simCardSelectedDetails?.niveau_trois_nom,
            point_emplacement: simCardSelectedDetails?.point_emplacement,
            usage_id: simCardSelectedDetails?.nom_usage,
            adresse_email: simCardSelectedDetails?.adresse_email,
            adresse_geographique: simCardSelectedDetails?.adresse_geographique,
            longitude: simCardSelectedDetails?.longitude,
            latitude: simCardSelectedDetails?.latitude,
            date_localisation: simCardSelectedDetails?.date_localisation,
            apn: simCardSelectedDetails?.apn,
            adresse_ip: simCardSelectedDetails?.adresse_ip,
            site_reseau: simCardSelectedDetails?.site_reseau,
        });
        this.mappingService.statutContrat(simCardSelectedDetails?.statut);
    }

    public initFormUpdateCarteSim(): void {
        this.formUpdateCarteSim = this.fb.group({
            sim_id: null,
            imsi: [
                { value: null, disabled: true },
                [
                    Validators.pattern('^[0-9]*$'),
                    Validators.maxLength(15),
                    Validators.minLength(15),
                ],
            ],
            iccid: [{ value: null, disabled: true }],
            msisdn: [
                { value: null, disabled: true },
                [
                    Validators.pattern('^[0-9]*$'),
                    Validators.maxLength(10),
                    Validators.minLength(10),
                ],
            ],
            formule: [{ value: null, disabled: true }],
            niveau_un_uuid: ['', Validators.required],
            niveau_deux_uuid: ['', Validators.required],
            niveau_trois_uuid: ['', Validators.required],
            point_emplacement: [''],
            usage_id: ['', Validators.required],
            adresse_email: [''],
            adresse_geographique: [''],
            longitude: [''],
            latitude: [''],
            date_localisation: [{ value: null, disabled: true }],
            apn: [{ value: null, disabled: true }],
            site_reseau: [{ value: null, disabled: true }],
            adresse_ip: [{ value: null, disabled: true }],
        });
        // this.formUpdateCarteSim
        //     ?.get('niveau_un_uuid')
        //     ?.valueChanges.subscribe(this.fetchSecondLevel.bind(this));

        const firstLevelControl = this.formUpdateCarteSim.get('niveau_un_uuid');
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
    }

    // async fetchSecondLevel(uuid: string): Promise<void> {
    //     this.listSecondLevel$ = await this.secondLevelService.getSecondLevel(
    //         uuid
    //     );
    // }

    public initFormDetailsCarteSim(): void {
        this.formDetailsCarteSim = this.fb.group({
            sim_id: null,
            type_personne: null,
            nom: null,
            prenoms: null,
            nature_piece: null,
            numero_piece: null,
            date_naissance: null,
            lieu_naissance: null,

            imsi: null,
            iccid: null,
            formule: null,

            niveau_un_uuid: null,
            niveau_deux_uuid: null,
            niveau_trois_uuid: null,

            point_emplacement: null,
            usage_id: null,
            adresse_email: null,

            adresse_geographique: null,
            longitude: null,
            latitude: null,

            date_localisation: null,
            apn: null,
            adresse_ip: null,
            site_reseau: null,

            msisdn: null,
            photo_carte_recto: null,
            photo_carte_verso: null,
            photo_physique: null,
        });
        const typePersonneControl =
            this.formIdentifierCarteSim?.get('type_personne');
        const gererValidationTypeUtilisateur = (value: string) => {
            if (value === TypeUtilisateur.PERSONNE) {
                this.displayPersonne = true;
            } else {
                this.displayPersonne = false;
            }
        };
        gererValidationTypeUtilisateur(typePersonneControl?.value);
        typePersonneControl?.valueChanges.subscribe((value) => {
            gererValidationTypeUtilisateur(value);
        });
    }

    public initFormIdentificationCarteSim(): void {
        this.formIdentifierCarteSim = this.fb.group({
            sim_id: null,
            type_personne: [null, Validators.required],
            nom: [null, Validators.required],
            prenoms: [null, Validators.required],
            nature_piece: [null, Validators.required],
            numero_piece: [null, Validators.required],
            date_naissance: [
                '',
                [Validators.required, this.validateDateOfBirth],
            ],
            lieu_naissance: [null, Validators.required],
            imsi: [{ value: null, disabled: true }],
            iccid: [{ value: null, disabled: true }],
            msisdn: [{ value: null, disabled: true }],
            photo_carte_recto: [''],
            photo_carte_verso: [''],
            photo_physique: [''],
        });
        const typePersonneControl =
            this.formIdentifierCarteSim.get('type_personne');
        const gererValidationTypeUtilisateur = (value: string) => {
            if (value === TypeUtilisateur.PERSONNE) {
                this.displayPersonne = true;
                this.isNoVerifyPiecesPhotos = true;
            } else {
                this.displayPersonne = false;
                this.isNoVerifyPiecesPhotos = false;
            }
        };
        gererValidationTypeUtilisateur(typePersonneControl?.value);
        typePersonneControl?.valueChanges.subscribe((value) => {
            gererValidationTypeUtilisateur(value);
        });
    }

    validateDateOfBirth(date: string): boolean {
        // Vérifier si la date est valide
        if (!moment(date, 'YYYY-MM-DD', true).isValid()) {
            return false;
        }

        // Obtenir la date actuelle
        const today = moment();

        // Vérifier si la date est dans le passé
        const enteredDate = moment(date, 'YYYY-MM-DD');
        if (!enteredDate.isBefore(today)) {
            return false;
        }

        // Vérifier si l'âge est raisonnable (entre 0 et 120 ans)
        const age = today.diff(enteredDate, 'years');
        if (age < 0 || age > 120) {
            return false;
        }

        return true; // La date est valide
    }

    async handleUpdateSimCard(): Promise<void> {
        const htmlMessage = `Les informations de la SIM <span style="color: #ff6600;"><strong>{msisdn}</strong></span> seront modifiée !`;
        const result = await Swal.mixin({
            customClass: SWALWITHBOOTSTRAPBUTTONSPARAMS.customClass,
        }).fire({
            ...SWALWITHBOOTSTRAPBUTTONSPARAMS.message,
            html: htmlMessage.replace(
                '{msisdn}',
                this.simCardSelectedDetails?.['msisdn']
            ),
        });
        if (result.isConfirmed) {
            const response: any = await handle(
                () =>
                    this.patrimoineService.UpdatePatrimoine(
                        this.formUpdateCarteSim.value
                    ),
                this.toastrService,
                this.loadingBar
            );
            response.error === false ? this.handleSuccessfulSave(response) : '';
        }
    }
    private handleSuccessfulSave(response: any): void {
        this.toastrService.success(response?.message);
        this.closeInterface();
        this.refreshListCartesSim();
    }

    private refreshListCartesSim(): void {
        combineLatest([
            this.simCardApiService.getDataFilterSimCard(),
            this.simCardApiService.getDataNbrPageSimCard(),
        ]).subscribe(([filterData, nbrPageData]) => {
            this.simCardApiService.fetchSimCard(filterData, nbrPageData);
        });
    }

    public closeInterface(): void {
        this.router.navigate([PATRIMONY + '/' + SIM_CARD]);
    }

    async handleAnalyzePiecePhoto(): Promise<void> {
        const formData = new FormData();
        formData.append('photo_physique', this.filesPhysique[0] ?? '');
        formData.append('photo_carte_verso', this.filesVerso[0] ?? '');
        formData.append('photo_carte_recto', this.filesRecto[0] ?? '');

        try {
            await Swal.fire({
                title: "Vous êtes sur le point d'analyser les images chargées",
                text: "Veuillez confirmer pour lancer l'analyse.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#569C5B',
                cancelButtonColor: '#dc3545',
                confirmButtonText: 'Confirmer',
                cancelButtonText: 'Annuler',
                showLoaderOnConfirm: true,
                allowOutsideClick: () => !Swal.isLoading(),
                backdrop: true,
                width: 800,
                preConfirm: async () => {
                    await this.processImages(formData);
                },
            });
        } catch (error) {
            console.error('Erreur lors de la confirmation :', error);
        }
    }

    private async processImages(formData: FormData): Promise<void> {
        try {
            // Appel de la méthode `handle`
            const response: any = await handle(
                () => this.patrimoineService.analysePiecePhoto(formData),
                this.toastrService,
                this.loadingBar
            );

            if (response.error) {
                Swal.fire({
                    title: 'Erreur',
                    text:
                        response.message ||
                        'Une erreur inattendue est survenue.',
                    icon: 'error',
                });
            } else {
                this.handleSuccessfulAnalysePiecePhoto(response);
            }
        } catch (error: any) {
            Swal.fire({
                title: 'Erreur',
                text: error.message,
                icon: 'error',
            });
        }
    }

    private async handleSuccessfulAnalysePiecePhoto(
        response: any
    ): Promise<void> {
        await Swal.fire({
            title: 'Analyse terminée',
            text:
                response?.message ||
                'Les images ont été analysées avec succès.',
            icon: 'success',
        });

        this.updateFormWithResponseData(response);
        this.toastrService.success(response?.message || 'Analyse réussie.');
        this.isNoVerifyPiecesPhotos = false;
    }

    private updateFormWithResponseData(response: any): void {
        this.formIdentifierCarteSim.patchValue({
            type_personne: TypeUtilisateur.PERSONNE,
            nom: response?.data?.nom || '',
            prenoms: response?.data?.prenoms || '',
            nature_piece: response?.data?.nature_piece || '',
            numero_piece: response?.data?.numero_piece || '',
            lieu_naissance: response?.data?.lieu_naissance || '',
            date_naissance:
                this.normalizeDate(response?.data?.date_naissance) || '',
        });
    }
    normalizeDate(input) {
        console.log('====================================');
        console.log(input);
        console.log('====================================');
        if (!input) return '';

        // Cas 1: format JJ/MM/AAAA ou JJ-MM-AAAA
        const regex = /^(\d{2})[\/\-](\d{2})[\/\-](\d{4})$/;
        const match = input.match(regex);
        if (match) {
            const [, day, month, year] = match;
            return `${day}/${month}/${year}`;
        }

        // Cas 2: format ISO valide déjà
        const isoDate: any = new Date(input);
        if (!isNaN(isoDate)) {
            return isoDate.toISOString().split('T')[0];
        }

        // Cas 3: format texte (ex: "15 février 1990")
        try {
            const date: any = new Date(Date.parse(input));
            if (!isNaN(date)) {
                return date.toISOString().split('T')[0];
            }
        } catch (_) {
            return '';
        }

        return '';
    }

    private get IdentifyCarteSimMessage(): string {
        if (
            this.formIdentifierCarteSim.get('type_personne')?.value ===
            TypeUtilisateur.PERSONNE
        ) {
            const THE_INFORMATION_OF_THIS_NATURAL_PERSON_WILL_BE_ATTACHED_TO_THE_SIM =
                this.translate.instant(
                    'THE_INFORMATION_OF_THIS_NATURAL_PERSON_WILL_BE_ATTACHED_TO_THE_SIM'
                );
            return `${THE_INFORMATION_OF_THIS_NATURAL_PERSON_WILL_BE_ATTACHED_TO_THE_SIM} <span style="color: #ff6600;"><strong>{msisdn}</strong></span> !`;
        } else {
            const THE_INFORMATION_OF_THE_CONNECTED_EQUIPMENT_WILL_BE_ATTACHED_TO_THE_SIM =
                this.translate.instant(
                    'THE_INFORMATION_OF_THE_CONNECTED_EQUIPMENT_WILL_BE_ATTACHED_TO_THE_SIM'
                );
            return `${THE_INFORMATION_OF_THE_CONNECTED_EQUIPMENT_WILL_BE_ATTACHED_TO_THE_SIM} <span style="color: #ff6600;"><strong>{msisdn}</strong></span> !`;
        }
    }

    async handleIdentifySimCard(): Promise<void> {
        const htmlMessage = this.IdentifyCarteSimMessage;
        const result = await Swal.mixin({
            customClass: SWALWITHBOOTSTRAPBUTTONSPARAMS.customClass,
        }).fire({
            ...SWALWITHBOOTSTRAPBUTTONSPARAMS.message,
            html: htmlMessage.replace(
                '{msisdn}',
                this.simCardSelectedDetails?.['msisdn']
            ),
        });
        if (result.isConfirmed) {
            const formData = new FormData();
            Object.keys(this.formIdentifierCarteSim.controls).forEach((key) => {
                const control = this.formIdentifierCarteSim.get(key);
                if (control && control.value) {
                    formData.append(key, control.value);
                }
            });
            formData.delete('date_naissance');
            formData.append(
                'date_naissance',
                moment(
                    this.formIdentifierCarteSim.get('date_naissance')?.value
                ).format('YYYY-MM-DD')
            );
            if (this.filesPhysique) {
                formData.append('photo_physique', this.filesPhysique[0] ?? '');
            }
            if (this.filesVerso) {
                formData.append('photo_carte_verso', this.filesVerso[0] ?? '');
            }
            if (this.filesRecto) {
                formData.append('photo_carte_recto', this.filesRecto[0] ?? '');
            }
            if (this.simCardSelectedDetails?.['is_identified'] === false) {
                const response: any = await handle(
                    () =>
                        this.patrimoineService.IdentificationPatrimoine(
                            formData
                        ),
                    this.toastrService,
                    this.loadingBar
                );
                response.error === false
                    ? this.handleSuccessfulSave(response)
                    : '';
            } else {
                const response: any = await handle(
                    () =>
                        this.patrimoineService.IdentificationPatrimoineUpdate(
                            formData
                        ),
                    this.toastrService,
                    this.loadingBar
                );
                response.error === false
                    ? this.handleSuccessfulSave(response)
                    : '';
            }
        }
    }

    public isDisabledButtonIdentifySimCard(): boolean {
        const typePersonneControl =
            this.formIdentifierCarteSim.get('type_personne');
        const photoPhysiqueControl =
            this.formIdentifierCarteSim.get('photo_physique');
        const photoCarteRectoControl =
            this.formIdentifierCarteSim.get('photo_carte_recto');
        const photoCarteVersoControl =
            this.formIdentifierCarteSim.get('photo_carte_verso');
        if (
            typePersonneControl?.value === TypeUtilisateur.EQUIPEMENT &&
            this.formIdentifierCarteSim.invalid
        ) {
            return true;
        } else if (
            typePersonneControl?.value === TypeUtilisateur.PERSONNE &&
            this.simCardSelectedDetails?.['is_identified'] &&
            this.formIdentifierCarteSim.invalid
        ) {
            return true;
        } else if (
            typePersonneControl?.value === TypeUtilisateur.PERSONNE &&
            this.simCardSelectedDetails?.['is_identified'] === false &&
            this.formIdentifierCarteSim.invalid &&
            !photoPhysiqueControl?.value &&
            !photoCarteRectoControl?.value &&
            !photoCarteVersoControl?.value
        ) {
            return true;
        } else {
            return false;
        }
    }

    get formatMsisdn(): string {
        const msisdn = this.simCardSelectedDetails?.msisdn || '';
        const formattedMsisdn = msisdn.replace(/(\d{2})(?=\d)/g, '$1 ');
        return formattedMsisdn;
    }

    onRemoveTemplatingFile(
        event: Event,
        file: any,
        removeFileCallback: Function,
        index: number,
        typeFile: 'physique' | 'recto' | 'verso'
    ): void {
        switch (typeFile) {
            case 'physique':
                this.filesPhysique.splice(index, 1);
                break;

            case 'recto':
                this.filesRecto.splice(index, 1);
                break;

            case 'verso':
                this.filesVerso.splice(index, 1);
        }
    }

    public handleRefreshData(simCardSelectedDetails: { msisdn: string }): void {
        Swal.fire({
            html: `Voulez-vous rafraîchir le solde Data ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#569C5B',
            cancelButtonColor: '#dc3545',
            cancelButtonText: 'Annuler',
            confirmButtonText: 'Oui',
        }).then((result) => {
            if (result.isConfirmed) {
                this.patrimoineService
                    .handleRefreshData({
                        msisdn: simCardSelectedDetails?.msisdn,
                    })
                    .subscribe(
                        (response: any) => {
                            this.toastrService.success(response.message);
                            this.closeInterface();
                        },
                        (error) => {
                            this.toastrService.error(error.error.message);
                        }
                    );
            }
        });
    }
}
