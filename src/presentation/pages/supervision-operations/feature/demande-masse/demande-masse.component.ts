import { FormatFormData } from 'src/shared/functions/formatFormData.function';
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { SupervisionOperationService } from "src/presentation/pages/supervision-operations/data-access/supervision-operation.service";
import { ToastrService } from "ngx-toastr";
import { LoadingBarService } from "@ngx-loading-bar/core";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MappingService } from 'src/shared/services/mapping.service';
import { SettingService } from 'src/shared/services/setting.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { handle } from 'src/shared/functions/api.function';
import { Justificatif } from 'src/shared/enum/Justificatif.enum';
import { StatutTransaction } from 'src/shared/enum/StatutTransaction.enum';
import { TraitementTransaction } from 'src/shared/enum/TraitementTransaction.enum';
import { EncodingDataService } from 'src/shared/services/encoding-data.service';
import { SharedDataService } from 'src/shared/services/shared-data.service';
import { BADGE_ETAT } from 'src/shared/constants/badge-etat.contant';
import { SWALWITHBOOTSTRAPBUTTONSPARAMS } from 'src/shared/constants/swalWithBootstrapButtonsParams.constant';
import { BADGE_ETAPE } from 'src/shared/constants/badge-etape.constant';
const Swal = require('sweetalert2');
@Component({
    selector: 'app-demande-masse',
    templateUrl: './demande-masse.component.html',
    styleUrls: ['./demande-masse.component.scss']
})

export class DemandeMasseComponent implements OnInit {
    public formMasseLibelle = {
        etape_1: "Cliquez pour télécharger le fichier conteant les SIMs activées par OCI",
        etape_2: "Etape 2 : Importez le fichier téléchargé complété avec les infos d'identifications de chaque SIM",
        etape_3: "Etape 3 : Vérifiez la cohérence et la complétude du fichier importé"
    } as const;
    public BADGE_ETAT = BADGE_ETAT;
    public BADGE_ETAPE = BADGE_ETAPE;
    public formTraitementMasse: FormGroup;
    @Input() params: { vue: "demande", action: "Abandonner" | "Identifier" } | { vue: "traitement", action: "Clôturer" };
    @Input() action: 'traiter' | 'cloturer' | 'Abandonner' | 'Traiter';
    @Input() IsLoadData;
    @Input() demande;
    @Output() IsLoading: EventEmitter<boolean> = new EventEmitter<boolean>();
    public response: any;
    public fileUrl: string;
    public listDemandes: any;
    public fileModel = "src/assets/data/Modele-Traitement-Activation-En-Masse.xlsx";
    public currentArrayHeaders = ['TRANSACTION', 'MSISDN', 'IMSI', 'ICCID', 'ADRESSE IP', 'APN', 'NOM EMPLACEMENT', 'ADRESSE EMAIL', 'ADRESSE GEO', 'LONGITUDE', 'LATITUDE'] as const;
    public listFormules: Array<any> = [];
    public firstLevelLibelle: string;
    public secondLevelLibelle: string;
    public thirdLevelLibelle: string;
    public listTypeJustificatif: Array<any> = [];
    public sourceStockOrangeSim: string;
    public selectedStockSim: string;
    public croixRougeCommentaire: boolean;
    public stateTraite: string = StatutTransaction.TARITER;
    public stateSoumis: string = StatutTransaction.SOUMIS;
    public treatmenEntente: string = TraitementTransaction.EN_ENTENTE;
    public stateCloture: string = StatutTransaction.CLOTURER;
    public treatmenAccepter: string = TraitementTransaction.ACCEPTER;
    public treatmenRejeter: string = TraitementTransaction.REJETER;
    public treatmenRefuser: string = TraitementTransaction.REFUSER;
    public treatmenAcquiter: string = TraitementTransaction.ACQUITER;
    public treatmenCancel: string = TraitementTransaction.ABANDONNER;

    constructor(private supervisionOperationService: SupervisionOperationService, private toastrService: ToastrService,
        private loadingBarService: LoadingBarService, private activeModal: NgbActiveModal, private mappingService: MappingService,
        private settingService: SettingService, private fb: FormBuilder, private sharedDataService: SharedDataService,
        private storage: EncodingDataService,) {
        this.firstLevelLibelle = this.mappingService.structureGlobale?.niveau_1;
        this.secondLevelLibelle = this.mappingService.structureGlobale?.niveau_2;
        this.thirdLevelLibelle = this.mappingService.structureGlobale?.niveau_3;
        this.selectedStockSim = "orangeci"
        Object.values(Justificatif).forEach((item) => {
            this.listTypeJustificatif.push(item);
        });
        this.fileUrl = this.mappingService.fileUrl;
        (this.sourceStockOrangeSim = this.mappingService.sourceStockOrangeSim);
    }

    ngOnInit() {
        this.initFormTraitementMasse();
        // this.GetFormules();
        this.GetSupervisionOperationsDemandesServicesDetails();
        this.IsJustificatif();
        this.IsRecuPaiement();
    }

    //

    public initFormTraitementMasse(): void {
        this.formTraitementMasse = this.fb.group({
            niveau_uns_uuid: this.createFormControl(this.listDemandes?.niveau_uns_nom, null, true),
            niveau_deux_uuid: this.createFormControl(this.listDemandes?.niveau_deux_nom, null, true),
            niveau_trois_uuid: this.createFormControl(this.listDemandes?.niveau_trois_nom, null, true),
            numero_demande: [this.listDemandes?.numero_demande],
            formule_uuid: this.createFormControl(this.listDemandes?.formule, Validators.required, true),
            usage_id: this.createFormControl(this.listDemandes?.usage_nom, null, true),
            nb_demande_soumises: this.createFormControl(this.listDemandes?.nb_demande_soumises, null, true),
            description: this.createFormControl(this.listDemandes?.description, null, true),
            operation: this.createFormControl(this.listDemandes?.operation, null, true),
            accepte: this.createFormControl(null, this.params.vue === 'traitement' ? Validators.required : null),
            commentaire: [this.commentairePatchValue()],
            sims_file: this.createFormControl(null, this.params.vue === 'demande' ? Validators.required : null),
            commentaire_traitement: this.createFormControl(this.listDemandes?.commentaire_traitement, null, true),
            commentaire_finalisation: this.createFormControl(this.listDemandes?.commentaire_finalisation, null, true),
            commentaire_cloture: this.createFormControl(this.listDemandes?.commentaire_cloture, null, true),
        });

        if (this.isTraiteState()) {
            this.updateFormForTraiteState();
        }


        this.formTraitementMasse.get('accepte')?.valueChanges.subscribe(this.handleAccepteChange.bind(this));
    }

    private commentairePatchValue(): string | null {
        switch (this.params.action) {
            case "Abandonner":
                return this.listDemandes?.commentaire_cloture;

            case "Clôturer":
                return this.listDemandes?.commentaire_cloture;

            default:
                return null;
        }
    }

    private createFormControl(initialValue: any, validator: any = null, isDisabled: boolean = false): any {
        return [{ value: initialValue, disabled: isDisabled }, validator].filter(v => v !== null);
    }

    private isTraiteState(): boolean {
        return this.listDemandes?.statut === this.stateTraite;
    }

    private updateFormForTraiteState(): void {
        const operationControl = this.formTraitementMasse.get('operation');
        operationControl?.patchValue('traiter');
        this.action = 'traiter';
        this.isRequiredFieldsetTraiter('traiter');
        this.isRequiredFieldsetDemande('traiter');
    }

    private handleAccepteChange(value: 'oui' | 'non'): void {
        this.isRequiredCommenatire(value);
    }

    //

    private isRequiredFieldsetDemande(value: 'traiter' | 'cloturer') {
        this.isRequiredFieldsetAccepte(value)
    }

    private isRequiredFieldsetTraiter(value: 'traiter' | 'cloturer') {
        if (value === 'traiter') {
            this.formTraitementMasse.get("sims_file").setValidators([Validators.required]);
        } else {
            this.formTraitementMasse.get("sims_file").clearValidators();
            this.formTraitementMasse.get("sims_file").disabled;
        }
        this.formTraitementMasse.get("sims_file").updateValueAndValidity();
    }

    private isRequiredCommenatire(value: 'oui' | 'non') {
        if (value === 'non') {
            this.croixRougeCommentaire = true;
            this.formTraitementMasse.get("commentaire").setValidators([Validators.required]);
        } else {
            this.croixRougeCommentaire = false;
            this.formTraitementMasse.get("commentaire").clearValidators();
            this.formTraitementMasse.get("commentaire").disabled;
        }
        this.formTraitementMasse.get("commentaire").updateValueAndValidity();
    }

    private isRequiredFieldsetAccepte(value: 'traiter' | 'cloturer') {
        if (value === 'cloturer') {
            this.formTraitementMasse.get("accepte").setValidators([Validators.required]);
        } else {
            this.formTraitementMasse.get("accepte").clearValidators();
            this.formTraitementMasse.get("accepte").disabled;
        }
        this.formTraitementMasse.get("accepte").updateValueAndValidity();
    }

    public getLabelForm() {
        if (this.listDemandes.statut === this.stateSoumis || this.listDemandes.traitement === this.treatmenEntente) {
            return "Modifier";
        }
        return "Enregistrer";
    }

    public displayButtonForm() {
        if (this.listDemandes?.statut === this.stateCloture || this.listDemandes?.statut !== 'en-traitement') {
            return true;
        }
        return false;
    }

    async GetSupervisionOperationsDemandesServicesDetails(dataToSend = this.demande?.numero_demande): Promise<void> {
        console.log('this.demande?.numero_demande', this.demande?.numero_demande)
        this.response = await handle(() => this.supervisionOperationService.GetSupervisionOperationsDemandesServicesDetails(dataToSend), this.toastrService, this.loadingBarService);
        this.listDemandes = this.response?.data;
        console.log('this.listDemandes', this.listDemandes)
        this.initFormTraitementMasse();
        this.IsLoading.emit(false);
    }

    async onSaveDemandes(dataToSend: {}): Promise<void> {
        dataToSend = { sims_file: this.formTraitementMasse.value.sims_file, numero_demande: this.listDemandes?.numero_demande };
        const htmlMessage = `Voulez-vous identifier la demande ?`;
        const result = await Swal.fire({ ...SWALWITHBOOTSTRAPBUTTONSPARAMS.message, html: htmlMessage })
        if (result.isConfirmed) {
            const response: any = await handle(() => this.supervisionOperationService.PostSupervisionOperationsTraitementsSuivisIdentificationsSims(FormatFormData(dataToSend)), this.toastrService, this.loadingBarService);
            if (response?.error === false) this.successHandle(response);
        }
    }
    async onSaveTraitements(dataToSend: {}): Promise<void> {
        dataToSend = { accepte: this.formTraitementMasse.value.accepte, numero_demande: this.listDemandes?.numero_demande, commentaire: this.formTraitementMasse?.value?.commentaire };
        const htmlMessage = `Voulez-vous clôturer la demande ?`;
        const result = await Swal.fire({ ...SWALWITHBOOTSTRAPBUTTONSPARAMS.message, html: htmlMessage });
        if (result.isConfirmed) {
            const response: any = await handle(() => this.supervisionOperationService.PostSupervisionOperationsTraitementsSuivisCloturerDemandeService(FormatFormData(dataToSend)), this.toastrService, this.loadingBarService);
            if (response?.error === false) this.successHandle(response);
        }
    }

    onLetDownDemands(dataToSend = { numero_demande: this.listDemandes?.numero_demande }) {
        Swal.mixin({ ...SWALWITHBOOTSTRAPBUTTONSPARAMS.button}).fire({
            title: "Vous êtes sur le point d'abandonner la demande",
            input: 'text',
            inputPlaceholder: 'Ex: Commentez...',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            cancelButtonText: "Annuler        ",
            confirmButtonText: "Confirmer",
            showLoaderOnConfirm: true,
            preConfirm: async (commentaire) => {
                try {
                    this.response = await handle(() => this.supervisionOperationService.PostSupervisionOperationsTraitementsSuivisAbandonnerDemandeService({ ...dataToSend, commentaire: commentaire }), this.toastrService, this.loadingBarService)
                    if (!this.response.ok) {
                        // return Swal.showValidationMessage(`${JSON.stringify(await this.response.message)}`);
                        if (!this.response?.error) this.successHandle(this.response)
                    }
                    // return this.response.message;
                } catch (error) {
                    console.log('error', error)
                    Swal.showValidationMessage(`Une erreur s'est produite`);
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {
                // this.successHandle(this.response);
            }
        })
    }

    private successHandle(response) {
        this.toastrService.success(response?.message);
        this.handleCloseModal();
        this.sharedDataService.sendPatrimoineSimDemandesServicesAll();
        this.sharedDataService.sendPatrimoineSimTraitementsDemandesAll();
    }

    public handleCloseModal(): void {
        this.activeModal.close();
    }

    public OnGetRapportCodeStyle(data: any): string {
        if (data?.etat_soumission === BADGE_ETAT.RECU && (data?.etat_cloture !== BADGE_ETAT.REFUSE || data?.etat_cloture !== BADGE_ETAT.REJETE)) {
            return "detailsDemandeColorBlue";
        } else if (data?.etat_soumission === BADGE_ETAT.ABANDONNE) {
            return "detailsDemandeColorYellow";
        } else if (data?.etat_traitement === BADGE_ETAT.REJETE || data?.etat_cloture === BADGE_ETAT.REFUSE) {
            return "detailsDemandeColorRed";
        } else if (data?.etat_traitement === BADGE_ETAT.PARTIEL || data?.etat_traitement === BADGE_ETAT.TOTAL) {
            return "detailsDemandeColorGreen";
        } else {
            return "detailsDemandeColorBlack";
        }
    }

    public pushCurrentArrayForm(file_upload) {
        this.formTraitementMasse.get("sims_file").patchValue(file_upload.sims_file);
    }

    public downloadFile() {
        if (!this.listDemandes?.justificatif) {
            this.toastrService.warning("Pas de justificatif pour cette operation");
        } else {
            window.open(this.fileUrl + this.listDemandes?.justificatif);
        }
    }

    public IsJustificatif(): boolean {
        return this.listDemandes?.justificatif ? true : false;
    }

    public downloadRecuPaiement() {
        if (!this.listDemandes?.recu_paiement) {
            this.toastrService.warning("Pas de recu de paiement pour cette operation");
        } else {
            window.open(this.fileUrl + this.listDemandes?.recu_paiement);
        }
    }

    public IsRecuPaiement(): boolean {
        return this.listDemandes?.recu_paiement ? true : false;
    }

    async onDownloadModel(): Promise<any> {
        const tokenUser = JSON.parse(this.storage.getData('user')).token;
        window.location.href = this.supervisionOperationService.GetGestionTransactionsDemandesServicesDownloadAbonnementsData(this.listDemandes?.numero_demande, tokenUser);
    }

    public canIdentify(demande: any): boolean {
        return (demande?.etat_traitement === "partiel" || demande?.etat_traitement === "total") && demande?.etat_finalisation === "clôturé";
    }
}