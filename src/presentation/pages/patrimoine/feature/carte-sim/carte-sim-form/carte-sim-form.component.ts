import { TypeUtilisateur } from './../../../../../../shared/enum/TypeUtilisateur.enum';
import { SWALWITHBOOTSTRAPBUTTONSPARAMS } from './../../../../../../shared/constants/swalWithBootstrapButtonsParams.constant';
import { CarteSimStateService } from 'src/presentation/pages/patrimoine/data-access/carte-sim/carte-sim-state.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from "ngx-toastr";
import { LoadingBarService } from "@ngx-loading-bar/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CARTES_SIM } from "src/presentation/pages/patrimoine/patrimoine-routing.module";
import { PATRIMOINE } from "src/shared/routes/routes";
import { Location } from '@angular/common';
import { PatrimoineService } from '../../../data-access/patrimoine.service';
import { CarteSimApiStateService } from '../../../data-access/carte-sim/carte-sim-api-state.service';
import { NaturePiece } from 'src/shared/enum/NaturePiece.enum';
import { NatureDocument } from 'src/shared/enum/NatureDocument.enum';
import { ApplicationType } from 'src/shared/enum/ApplicationType.enum';
const Swal = require('sweetalert2');
import * as moment from 'moment';
import { handle } from '../../../../../../shared/functions/api.function';
import { AccessFeature, MappingService } from '../../../../../../shared/services/mapping.service';
import { EncodingDataService } from '../../../../../../shared/services/encoding-data.service';
import { PatrimoinesService } from '../../../data-access/patrimoines.service';
import { AsFeatureService } from '../../../../../../shared/services/as-feature.service';
import { OperationTransaction } from '../../../../../../shared/enum/OperationTransaction.enum';
interface UploadEvent {
    originalEvent: Event;
    files: File[];
}

type TYPEVIEW = "update-sim-card" | "view-sim-card" | "identification-sim-card";
const TYPEVIEW_VALUES: TYPEVIEW[] = ["update-sim-card", "view-sim-card", "identification-sim-card"];
function isTypeView(value: any): value is TYPEVIEW {
    return TYPEVIEW_VALUES.includes(value);
}
@Component({
    selector: 'app-carte-sim-form',
    templateUrl: './carte-sim-form.component.html',
    styleUrls: [`./carte-sim-form.component.scss`]
})

export class CarteSimFormComponent implements OnInit {
    public module: string;
    public subModule: string;
    public urlParamRef: TYPEVIEW;
    public urlParamFilter: Object;
    public urlParamCurrentPage: string;
    public urlParamId: string;
    public displayUrlErrorPage: boolean = false;
    public loadingPage: boolean = true;

    public formUpdateCarteSim: FormGroup;
    public formIdentifierCarteSim: FormGroup;
    public formDetailsCarteSim: FormGroup;
    public listExploitations: Array<any> = [];
    public listUsage: Array<any> = [];
    public listActivites: Array<any> = [];
    public firstLevelLibelle: string;
    public secondLevelLibelle: string;
    public thirdLevelLibelle: string;

    public filesPhysique = [];
    public filesRecto = [];
    public filesVerso = [];
    public listeTypeUtilisateur: Array<any> = [];
    public listeNaturePiece: Array<any> = [];
    public listeNatureDocument: Array<any> = [];
    public displayPersonne: boolean = false;
    public isNoVerifyPiecesPhotos: boolean = false;

    public listDR: Array<Object>;
    public carteSimSelected: Object | void;
    public carteSimSelectedDetails: Object;
    public totalSizePercent: number = 0;
    public imageURLs: { [key: string]: string } = {};

    public applicationType: string;
    public patrimoineType: string;
    public activation: string = OperationTransaction.ACTIVATION;
    public TypeUtilisateur = TypeUtilisateur;
    public asAccessFeature: AccessFeature;
    public asAccessFeatureIdentification: boolean;
    public asAccessFeatureDataBalance: boolean;
    public asAccessFeatureSmsBalance: boolean;

    constructor(private activatedRoute: ActivatedRoute, private patrimoinesService: PatrimoinesService,
        private loadingBar: LoadingBarService, private toastrService: ToastrService,
        private carteSimStateService: CarteSimStateService, private fb: FormBuilder,
        public mappingService: MappingService, private router: Router, private location: Location,
        private patrimoineService: PatrimoineService, private carteSimApiStateService: CarteSimApiStateService,
        private storage: EncodingDataService, private asFeatureService: AsFeatureService) {
            this.asAccessFeatureIdentification = this.asFeatureService.hasFeature(OperationTransaction.IDENTIFICATION);
        this.asAccessFeatureDataBalance = this.asFeatureService.hasFeature(OperationTransaction.SOLDE_DATA);
        this.asAccessFeatureSmsBalance = this.asFeatureService.hasFeature(OperationTransaction.SOLDE_SMS);
        this.firstLevelLibelle = this.mappingService.structureGlobale?.niveau_1;
        this.secondLevelLibelle = this.mappingService.structureGlobale?.niveau_2;
        this.thirdLevelLibelle = this.mappingService.structureGlobale?.niveau_3;
        this.applicationType = this.mappingService.applicationType;
        this.asAccessFeature = JSON.parse(this.storage.getData('variables')).modules;
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
        this.activatedRoute.data.subscribe((data) => {
            this.module = data.module;
            this.subModule = data.subModule[0];
        });
        this.getParamsInUrl();
        this.getAllDR();
        this.getAllUsages();
        this.getAllZones();
    }

    private getParamsInUrl(): void {
        this.activatedRoute.queryParams.subscribe((params: Object) => {
            this.urlParamRef = params?.["ref"];
            this.urlParamCurrentPage = params?.["current_page"];
            this.urlParamFilter = this.carteSimStateService.getFilterCarteSimState(params?.["filter"]);
        });
        switch (this.urlParamRef) {
            case "update-sim-card": this.initFormUpdateCarteSim(); break;
            case "identification-sim-card": this.initFormIdentificationCarteSim(); break;
            case "view-sim-card": this.initFormDetailsCarteSim(); break;
        }
        this.urlParamId = this.activatedRoute.snapshot.paramMap.get('id');
        // si la ref dans l'url est different de  "update-sim-card" | "view-sim-card" | "ajouter" alors affiche la page d'error
        if (!isTypeView(this.urlParamRef)) {
            this.displayUrlErrorPage = true;
        } else {
            switch (this.urlParamRef) {
                case "view-sim-card":
                    this.pageCallback(this.urlParamFilter, this.urlParamCurrentPage);
                    this.formDetailsCarteSim.disable();
                    break;

                case "update-sim-card":
                case "identification-sim-card":
                    this.pageCallback(this.urlParamFilter, this.urlParamCurrentPage);
                    break;
            }
        }
    }
    pageCallback(urlParamFilter: Object = {}, urlParamCurrentPage: string = "1") {
        this.patrimoinesService.fetchSims(urlParamFilter, urlParamCurrentPage)
        this.patrimoinesService.getSims().subscribe((value) => {
            this.getCarteSimSelected(value);
        });
        // const response: any = await handle(() => this.patrimoinesService.PostPatrimoineSimSimsAllPage(urlParamFilter, urlParamCurrentPage), this.toastrService, this.loadingBar);
        // if (response.error === false) this.handleSuccessfulPageCallback(response, urlParamFilter);
    }


    // private handleSuccessfulPageCallback(response: any, urlParamFilter: any): void {
    //     const listCartesSim: any = response?.data?.data;
    //     this.carteSimStateService.setFilterCarteSimState(urlParamFilter);
    //     this.getCarteSimSelected(listCartesSim);
    // }

    private getCarteSimSelected(listCartesSim): void {
        this.carteSimSelected = listCartesSim.find((e) => e.msisdn == this.urlParamId);
        // si l'identifiant dans l'url ne correspond pas a un elements dans la liste alors affiche la page d'error
        if (this.carteSimSelected) {
            this.carteSimStateService.setItemSelectedState(this.carteSimSelected);
            this.getCarteSimSelectedDetails(this.carteSimSelected['imsi']);
        } else {
            this.displayUrlErrorPage = true;
        }
    }

    async getCarteSimSelectedDetails(carteSimSelectedImsi: string): Promise<any> {
        this.patrimoinesService.fetchSimsDetails(carteSimSelectedImsi)
        this.patrimoinesService.getSimsDetails().subscribe((value) => {
            this.carteSimSelectedDetails = value;
            switch (this.urlParamRef) {
                case "update-sim-card": this.patchValueFormUpdateCarteSim(this.carteSimSelectedDetails); break;
                case "identification-sim-card": this.patchValueFormIdentifierCarteSim(this.carteSimSelectedDetails); break;
                case "view-sim-card": this.patchValueFormDetailsCarteSim(this.carteSimSelectedDetails); break;
            }
        });

        // const response: any = await handle(() => this.patrimoinesService.PostPatrimoineSimSimsimsiDetails(carteSimSelectedImsi), this.toastrService, this.loadingBar);
        // if (response) {
        //     this.carteSimSelectedDetails = response.data;
        //     switch (this.urlParamRef) {
        //         case "update-sim-card": this.patchValueFormUpdateCarteSim(response.data); break;
        //         case "identification-sim-card": this.patchValueFormIdentifierCarteSim(response.data); break;
        //         case "view-sim-card": this.patchValueFormDetailsCarteSim(response.data); break;
        //     }
        // };
        this.loadingPage = false;
    }

    private patchValueFormIdentifierCarteSim(carteSimSelectedDetails: any): void {
        this.formIdentifierCarteSim.patchValue({
            sim_id: carteSimSelectedDetails?.id,
            type_personne: carteSimSelectedDetails.type_personne,
            nom: carteSimSelectedDetails.nom,
            prenoms: carteSimSelectedDetails.prenoms,
            nature_piece: carteSimSelectedDetails.nature_piece,
            numero_piece: carteSimSelectedDetails.numero_piece,
            imsi: carteSimSelectedDetails?.imsi,
            iccid: carteSimSelectedDetails?.iccid,
            msisdn: carteSimSelectedDetails?.msisdn,
            date_naissance: carteSimSelectedDetails?.date_naissance ? new Date(carteSimSelectedDetails?.date_naissance) : '',
            lieu_naissance: carteSimSelectedDetails?.lieu_naissance,
        });
        if (carteSimSelectedDetails?.photo_carte_recto) {
            this.imageURLs['recto'] = carteSimSelectedDetails?.photo_carte_recto ?? '';
        }
        if (carteSimSelectedDetails?.photo_carte_verso) {
            this.imageURLs['verso'] = carteSimSelectedDetails?.photo_carte_verso ?? '';
        }
        if (carteSimSelectedDetails?.photo_physique) {
            this.imageURLs['physique'] = carteSimSelectedDetails.photo_physique ?? '';
        }
    }


    private patchValueFormUpdateCarteSim(carteSimSelectedDetails: any): void {
        this.formUpdateCarteSim.patchValue({
            sim_id: carteSimSelectedDetails?.id,
            imsi: carteSimSelectedDetails?.imsi,
            iccid: carteSimSelectedDetails?.iccid,
            msisdn: carteSimSelectedDetails?.msisdn,
            formule: carteSimSelectedDetails?.formule,
            niveau_un_uuid: carteSimSelectedDetails?.niveau_un_uuid,
            niveau_deux_uuid: carteSimSelectedDetails?.niveau_deux_uuid,
            niveau_trois_uuid: carteSimSelectedDetails?.niveau_trois_uuid,
            point_emplacement: carteSimSelectedDetails?.point_emplacement,
            usage_id: carteSimSelectedDetails?.usage_id,
            adresse_email: carteSimSelectedDetails?.adresse_email,
            adresse_geographique: carteSimSelectedDetails?.adresse_geographique,
            longitude: carteSimSelectedDetails?.longitude,
            latitude: carteSimSelectedDetails?.latitude,
            date_trafic: carteSimSelectedDetails?.date_trafic,
            apn: carteSimSelectedDetails?.apn,
            adresse_ip: carteSimSelectedDetails?.adresse_ip,
            site_reseau: carteSimSelectedDetails?.site_reseau,
        });
    }


    private patchValueFormDetailsCarteSim(carteSimSelectedDetails: any): void {
        this.formDetailsCarteSim.patchValue({
            sim_id: carteSimSelectedDetails?.id,
            type_personne: carteSimSelectedDetails?.type_personne,
            nom: carteSimSelectedDetails?.nom,
            prenoms: carteSimSelectedDetails?.prenoms,
            nature_piece: carteSimSelectedDetails?.nature_piece,
            numero_piece: carteSimSelectedDetails?.numero_piece,
            imsi: carteSimSelectedDetails?.imsi,
            iccid: carteSimSelectedDetails?.iccid,
            msisdn: carteSimSelectedDetails?.msisdn,
            formule: carteSimSelectedDetails?.formule,
            date_naissance: carteSimSelectedDetails?.date_naissance,
            lieu_naissance: carteSimSelectedDetails?.lieu_naissance,
            niveau_un_uuid: carteSimSelectedDetails?.niveau_uns_nom,
            niveau_deux_uuid: carteSimSelectedDetails?.niveau_deux_nom,
            niveau_trois_uuid: carteSimSelectedDetails?.niveau_trois_nom,
            point_emplacement: carteSimSelectedDetails?.point_emplacement,
            usage_id: carteSimSelectedDetails?.nom_usage,
            adresse_email: carteSimSelectedDetails?.adresse_email,
            adresse_geographique: carteSimSelectedDetails?.adresse_geographique,
            longitude: carteSimSelectedDetails?.longitude,
            latitude: carteSimSelectedDetails?.latitude,
            date_trafic: carteSimSelectedDetails?.date_trafic,
            apn: carteSimSelectedDetails?.apn,
            adresse_ip: carteSimSelectedDetails?.adresse_ip,
            site_reseau: carteSimSelectedDetails?.site_reseau,
        });
        this.mappingService.statutContrat(carteSimSelectedDetails?.statut)
    }

    async handleUpdateCampagne(): Promise<void> {
        const htmlMessage = `Les informations de la SIM <span style="color: #ff6600;"><strong>{msisdn}</strong></span> seront modifiée !`;
        const result = await Swal.mixin({ customClass: SWALWITHBOOTSTRAPBUTTONSPARAMS.customClass })
            .fire({
                ...SWALWITHBOOTSTRAPBUTTONSPARAMS.message, html: htmlMessage
                    .replace('{msisdn}', this.carteSimSelectedDetails?.["msisdn"])
            });
        if (result.isConfirmed) {
            const response: any = await handle(() => this.patrimoineService.UpdatePatrimoine(this.formUpdateCarteSim.value), this.toastrService, this.loadingBar);
            response.error === false ? this.handleSuccessfulSave(response) : "";
        }
    }

    async handleAnalysePiecePhoto(): Promise<void> {
        const formData = new FormData();
        formData.append("photo_physique", this.filesPhysique[0] ?? "");
        formData.append("photo_carte_verso", this.filesVerso[0] ?? "");
        formData.append("photo_carte_recto", this.filesRecto[0] ?? "");

        try {
            await Swal.fire({
                title: "Vous êtes sur le point d'analyser les images chargées",
                text: "Veuillez confirmer pour lancer l'analyse.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#569C5B",
                cancelButtonColor: "#dc3545",
                confirmButtonText: "Confirmer",
                cancelButtonText: "Annuler",
                showLoaderOnConfirm: true,
                allowOutsideClick: () => !Swal.isLoading(),
                backdrop: true,
                width: 800,
                preConfirm: async () => {
                    await this.processImages(formData);
                }
            });
        } catch (error) {
            console.error("Erreur lors de la confirmation :", error);
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
                    title: "Erreur",
                    text: response.message || "Une erreur inattendue est survenue.",
                    icon: "error",
                });
            } else {
                this.handleSuccessfulAnalysePiecePhoto(response);
            }

        } catch (error: any) {

            Swal.fire({
                title: "Erreur",
                text: error.message,
                icon: "error",
            });
        }
    }

    private async handleSuccessfulAnalysePiecePhoto(response: any): Promise<void> {
        await Swal.fire({
            title: "Analyse terminée",
            text: response?.message || "Les images ont été analysées avec succès.",
            icon: "success",
        });

        this.updateFormWithResponseData(response);
        this.toastrService.success(response?.message || "Analyse réussie.");
        this.isNoVerifyPiecesPhotos = false;
    }

    private updateFormWithResponseData(response: any): void {
        this.formIdentifierCarteSim.patchValue({
            type_personne: TypeUtilisateur.PERSONNE,
            nom: response?.data?.nom || "",
            prenoms: response?.data?.prenoms || "",
            nature_piece: response?.data?.nature_piece || "",
            numero_piece: response?.data?.numero_piece || "",
            lieu_naissance: response?.data?.lieu_naissance || "",
            date_naissance: response?.data?.date_naissance ? new Date(response.data.date_naissance)
                : "",
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

    async handleIdentifyCarteSim(): Promise<void> {
        this.formIdentifierCarteSim.get("date_naissance")?.setValue(moment(this.formIdentifierCarteSim.get("date_naissance")?.value).format('YYYY-MM-DD') ?? '')
        const htmlMessage = this.formIdentifierCarteSim.get("type_personne")?.value === TypeUtilisateur.PERSONNE ?
            `Les informations de la personne physique seront rattachées à la SIM <span style="color: #ff6600;"><strong>{msisdn}</strong></span> !` :
            `Les informations de l'équipement connecté seront rattachées à la SIM <span style="color: #ff6600;"><strong>{msisdn}</strong></span> !`;
        const result = await Swal.mixin({ customClass: SWALWITHBOOTSTRAPBUTTONSPARAMS.customClass })
            .fire({
                ...SWALWITHBOOTSTRAPBUTTONSPARAMS.message,
                html: htmlMessage.replace('{msisdn}', this.carteSimSelectedDetails?.["msisdn"])
            });
        if (result.isConfirmed) {
            const formData = new FormData();
            Object.keys(this.formIdentifierCarteSim.controls).forEach(key => {
                const control = this.formIdentifierCarteSim.get(key);
                if (control && control.value) {
                    formData.append(key, control.value);
                }
            });
            if (this.filesPhysique) {
                formData.append('photo_physique', this.filesPhysique[0] ?? '');
            }
            if (this.filesVerso) {
                formData.append('photo_carte_verso', this.filesVerso[0] ?? '');
            }
            if (this.filesRecto) {
                formData.append('photo_carte_recto', this.filesRecto[0] ?? '');
            }
            if (this.carteSimSelectedDetails?.["is_identified"] === false) {
                const response: any = await handle(() => this.patrimoineService.IdentificationPatrimoine(formData), this.toastrService, this.loadingBar);
                response.error === false ? this.handleSuccessfulSave(response) : "";
            } else {
                const response: any = await handle(() => this.patrimoineService.IdentificationPatrimoineUpdate(formData), this.toastrService, this.loadingBar);
                response.error === false ? this.handleSuccessfulSave(response) : "";
            }
        }

    }
    private handleSuccessfulSave(response: any): void {
        this.toastrService.success(response?.message);
        this.closeInterface();
        this.carteSimApiStateService.refreshListCartesSim();
    }
    public initFormIdentificationCarteSim(): void {
        this.formIdentifierCarteSim = this.fb.group({
            sim_id: null,
            type_personne: [null, Validators.required],
            nom: [null, Validators.required],
            prenoms: [null, Validators.required],
            nature_piece: [null, Validators.required],
            numero_piece: [null, Validators.required],
            date_naissance: ['', [Validators.required, this.validateDateOfBirth]],
            lieu_naissance: [null, Validators.required],
            imsi: [{ value: null, disabled: true }],
            iccid: [{ value: null, disabled: true }],
            msisdn: [{ value: null, disabled: true }],
            photo_carte_recto: [''],
            photo_carte_verso: [''],
            photo_physique: [''],
        });
        const typePersonneControl = this.formIdentifierCarteSim.get('type_personne');
        const gererValidationTypeUtilisateur = (value: string) => {
            if (value === TypeUtilisateur.PERSONNE) {
                this.displayPersonne = true;
                this.isNoVerifyPiecesPhotos = true
            } else {
                this.displayPersonne = false;
                this.isNoVerifyPiecesPhotos = false
            }
        };
        gererValidationTypeUtilisateur(typePersonneControl?.value);
        typePersonneControl?.valueChanges.subscribe((value) => {
            gererValidationTypeUtilisateur(value);
        });
    }


    public isDisabledButtonIdentifyCarteSim() {
        const typePersonneControl = this.formIdentifierCarteSim.get('type_personne');
        const photoPhysiqueControl = this.formIdentifierCarteSim.get('photo_physique');
        const photoCarteRectoControl = this.formIdentifierCarteSim.get('photo_carte_recto');
        const photoCarteVersoControl = this.formIdentifierCarteSim.get('photo_carte_verso');
        if (typePersonneControl?.value === TypeUtilisateur.EQUIPEMENT && this.formIdentifierCarteSim.invalid) {
            return true;
        } else if (typePersonneControl?.value === TypeUtilisateur.PERSONNE &&
            this.carteSimSelectedDetails?.['is_identified'] &&
            this.formIdentifierCarteSim.invalid) {
            return true;
        } else if (typePersonneControl?.value === TypeUtilisateur.PERSONNE &&
            this.carteSimSelectedDetails?.['is_identified'] === false &&
            this.formIdentifierCarteSim.invalid &&
            !photoPhysiqueControl?.value &&
            !photoCarteRectoControl?.value &&
            !photoCarteVersoControl?.value) {
            return true;
        } else {
            return false
        }
    }

    public initFormUpdateCarteSim(): void {

        this.formUpdateCarteSim = this.fb.group({
            sim_id: null,
            imsi: [{ value: null, disabled: true }, [Validators.pattern("^[0-9]*$"), Validators.maxLength(15), Validators.minLength(15)]],
            iccid: [{ value: null, disabled: true }],
            msisdn: [{ value: null, disabled: true }, [Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(10)]],
            formule: [{ value: null, disabled: true }],
            niveau_un_uuid: ['', Validators.required],
            niveau_deux_uuid: ['', Validators.required],
            niveau_trois_uuid: ['', Validators.required],
            point_emplacement: [''],
            usage_id: ['', Validators.required],
            adresse_email: ['', [Validators.email, Validators.required]],
            adresse_geographique: ['', Validators.required],
            longitude: [''],
            latitude: [''],
            date_trafic: [{ value: null, disabled: true }],
            apn: [{ value: null, disabled: true }],
            site_reseau: [{ value: null, disabled: true }],
            adresse_ip: [{ value: null, disabled: true }],
        });
        this.formUpdateCarteSim?.get('niveau_un_uuid')?.valueChanges.subscribe(this.getAllExploitation.bind(this));
    }

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

            date_trafic: null,
            apn: null,
            adresse_ip: null,
            site_reseau: null,

            msisdn: null,
            photo_carte_recto: null,
            photo_carte_verso: null,
            photo_physique: null,

        });
        const typePersonneControl = this.formIdentifierCarteSim?.get('type_personne');
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

    async getAllExploitation(selectedDRId: number) {
        const response: any = await handle(() => this.patrimoinesService.PostParametresSecuriteNiveauDeuxSimple({ niveau_un_uuid: selectedDRId }), this.toastrService, this.loadingBar);
        if (response) this.listExploitations = response.data;
    }

    async getAllDR(): Promise<void> {
        const response: any = await handle(() => this.patrimoinesService.PostParametresSecuriteNiveauUnSimple({}), this.toastrService, this.loadingBar);
        if (response) this.listDR = response.data;
    }

    async getAllUsages(): Promise<void> {
        const response: any = await handle(() => this.patrimoinesService.PostPatrimoineSimSimsAllUsages({}), this.toastrService, this.loadingBar);
        if (response) this.listUsage = response.data;
    }

    async getAllZones(): Promise<void> {
        const response: any = await handle(() => this.patrimoinesService.PostParametresSecuriteNiveauTroisSimple({}), this.toastrService, this.loadingBar);
        if (response) this.listActivites = response.data;
    }

    public onGoToBack(): void {
        this.location.back();
    }

    public closeInterface(): void {
        this.router.navigate([PATRIMOINE + "/" + CARTES_SIM]);
    }

    getFormattedMsisdn(value): string {
        const msisdn = value || ""; // Assurez-vous que msisdn est défini
        const formattedMsisdn = msisdn.replace(/(\d{2})(?=\d)/g, "$1 "); // Ajoute le séparateur
        return formattedMsisdn;
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

    onRemoveTemplatingFile(event: Event, file: any, removeFileCallback: Function, index: number, typeFile: 'physique' | 'recto' | 'verso'): void {
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


    public handleRefreshData(data: any): void {
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
                        msisdn: data?.msisdn,
                    }).subscribe(
                        (response: any) => {
                            this.toastrService.success(response.message);
                            this.closeInterface();
                        },
                        (error) => {
                            this.toastrService.error(error.error.message);
                        }
                    )
            }
        });
    }
}