import { FormatFormData } from 'src/shared/functions/formatFormData.function';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LoadingBarService } from '@ngx-loading-bar/core';
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
import { OperationTransaction } from 'src/shared/enum/OperationTransaction.enum';
import { DemandesProduitsService } from '../../../demandes-produits/data-access/demandes-produits.service';
import { SupervisionOperationService } from '../../data-access/supervision-operation.service';
import { getRapportCodeStyle } from '../../../../../shared/functions/rapport-code-style.function';
import { BADGE_STAUT_PAIEMENT } from '../../../../../shared/constants/badge-statut-paiement';
const Swal = require('sweetalert2');
@Component({
    selector: 'app-demande-masse',
    templateUrl: './demande-masse.component.html',
    styleUrls: ['./demande-masse.component.scss'],
})
export class DemandeMasseComponent implements OnInit {
    public formMasseLibelle = {
        etape_1:
            'Cliquez pour télécharger le fichier contenant les SIMs activées par OCI',
        etape_2:
            "Etape 2 : Importez le fichier téléchargé complété avec les infos d'identifications de chaque SIM",
        etape_3:
            'Etape 3 : Vérifiez la cohérence et la complétude du fichier importé',
    } as const;
    public libelleFile = {
        file1: 'Télécharger le modèle',
        file2: 'Charger le fichier',
    } as const;
    public BADGE_ETAT = BADGE_ETAT;
    public BADGE_ETAPE = BADGE_ETAPE;
    public formTraitementMasse: FormGroup;
    @Input() params:
        | { vue: 'activation'; action: 'Abandonner' | 'Identifier' }
        | { vue: 'sim-blanche'; action: 'Abandonner' | 'Identifier' }
        | { vue: 'traitement'; action: 'Clôturer' };
    @Input() action: 'traiter' | 'cloturer' | 'Abandonner' | 'Traiter';
    @Input() IsLoadData;
    @Input() demande;
    @Output() IsLoading: EventEmitter<boolean> = new EventEmitter<boolean>();
    public response: any;
    public fileUrl: string;
    public listDemandes: any;
    public fileModel =
        'src/assets/data/Modele-Traitement-Activation-En-Masse.xlsx';
    public currentArrayHeaders = [
        'TRANSACTION',
        'MSISDN',
        'IMSI',
        'ICCID',
        'ADRESSE IP',
        'APN',
        'NOM EMPLACEMENT',
        'ADRESSE EMAIL',
        'ADRESSE GEO',
        'LONGITUDE',
        'LATITUDE',
    ] as const;
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
    public TYPE_FORM = OperationTransaction;
    public BADGE_STAUT_PAIEMENT = BADGE_STAUT_PAIEMENT;

    constructor(
        private supervisionOperationService: SupervisionOperationService,
        private toastrService: ToastrService,
        private loadingBarService: LoadingBarService,
        private activeModal: NgbActiveModal,
        private mappingService: MappingService,
        private settingService: SettingService,
        private fb: FormBuilder,
        private sharedDataService: SharedDataService,
        private storage: EncodingDataService
    ) {
        this.firstLevelLibelle = this.mappingService.structureGlobale?.niveau_1;
        this.secondLevelLibelle =
            this.mappingService.structureGlobale?.niveau_2;
        this.thirdLevelLibelle = this.mappingService.structureGlobale?.niveau_3;
        this.selectedStockSim = 'orangeci';
        Object.values(Justificatif).forEach((item) => {
            this.listTypeJustificatif.push(item);
        });
        this.fileUrl = this.mappingService.fileUrl;
        this.sourceStockOrangeSim = this.mappingService.sourceStockOrangeSim;
    }

    ngOnInit() {
        this.initFormTraitementMasse();
        // this.GetFormules();
        if (this.params.vue === 'sim-blanche') {
            this.getAllProduits();
        } else {
            this.GetSupervisionOperationsDemandesServicesDetails();
        }
    }

    public truncateString(str: string, maxLength: number = 20): string {
        if (str && str.length > maxLength) {
            return str.substring(0, maxLength) + '...';
        }
        return str || '';
    }

    public initFormTraitementMasse(): void {
        this.formTraitementMasse = this.fb.group({
            niveau_uns_uuid: this.createFormControl(
                this.listDemandes?.niveau_uns_nom,
                null,
                true
            ),
            niveau_deux_uuid: this.createFormControl(
                this.listDemandes?.niveau_deux_nom,
                null,
                true
            ),
            niveau_trois_uuid: this.createFormControl(
                this.listDemandes?.niveau_trois_nom,
                null,
                true
            ),
            numero_demande: [this.listDemandes?.numero_demande],
            formule_uuid: this.createFormControl(
                this.listDemandes?.formule,
                Validators.required,
                true
            ),
            usage_id: this.createFormControl(
                this.listDemandes?.usage_nom,
                null,
                true
            ),
            montant_formule: this.createFormControl(
                this.listDemandes?.montant_formule,
                null,
                true
            ),
            description: this.createFormControl(
                this.listDemandes?.description,
                null,
                true
            ),
            accepte: this.createFormControl(
                this.listDemandes?.etat_cloture,
                this.params.vue === 'traitement' ? Validators.required : null,
                false
            ),
            commentaire: [this.commentairePatchValue()],
            sims_file: this.createFormControl(
                null,
                this.params.vue === 'activation' ? Validators.required : null
            ),
            commentaire_traitement: this.createFormControl(
                this.getNonNullValue(this.listDemandes?.commentaire_traitement),
                null,
                true
            ),
            commentaire_finalisation: this.createFormControl(
                this.listDemandes?.commentaire_finalisation,
                null,
                true
            ),
            commentaire_cloture: this.createFormControl(
                this.listDemandes?.commentaire_cloture,
                null,
                true
            ),
            notation_cloture: this.createFormControl(
                this.listDemandes?.notation_cloture,
                this.isRequireNotationCloture ? Validators.required : null,
                false
            ),

            operation: this.createFormControl(
                this.formatTitle(this.listDemandes?.operation),
                null,
                true
            ),
            nb_demande_soumises: this.createFormControl(
                this.params.vue === 'sim-blanche'
                    ? this.listDemandes?.qte
                    : this.listDemandes?.nb_demande_soumises,
                null,
                true
            ),
            prix_unitaire: this.createFormControl(
                this.listDemandes?.['prix_unitaire'],
                null,
                true
            ),
            prix_ht: this.createFormControl(
                this.listDemandes?.['prix_ht'],
                null,
                true
            ),
            prix_ttc: this.createFormControl(
                this.listDemandes?.['prix_ttc'],
                null,
                true
            ),

            montant: this.createFormControl(
                this.listDemandes?.['montant'],
                null,
                true
            ),
        });

        if (this.isTraiteState()) {
            this.updateFormForTraiteState();
        }

        this.formTraitementMasse
            .get('accepte')
            ?.valueChanges.subscribe(this.handleAccepteChange.bind(this));
    }

    get isRequireNotationCloture() {
        return (
            this.listDemandes?.statut === BADGE_ETAPE.FINALISATEUR &&
            this.listDemandes?.traitement === BADGE_ETAT.EFFECTUE
        );
    }

    get asClosed(): boolean {
        return (
            this.listDemandes?.statut === BADGE_ETAPE.CLOTURE &&
            this.listDemandes?.traitement === BADGE_ETAT.TERMINE
        );
    }

    // Nouvelle méthode pour gérer les valeurs null ou 'null'
    private getNonNullValue(value: any): string {
        return value === 'null' || value === null || value === undefined
            ? ''
            : value;
    }

    public formatTitle(title: string) {
        return this.supervisionOperationService.HandleFormatTitle(title);
    }

    private commentairePatchValue(): string | null {
        switch (this.params.action) {
            case 'Abandonner':
                return this.listDemandes?.commentaire_cloture;

            case 'Clôturer':
                return this.listDemandes?.commentaire_cloture;

            default:
                return '';
        }
    }

    private createFormControl(
        initialValue: any,
        validator: any = null,
        isDisabled: boolean = false
    ): any {
        return [
            { value: initialValue, disabled: isDisabled },
            validator,
        ].filter((v) => v !== null);
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
        this.isRequiredFieldsetAccepte(value);
    }

    private isRequiredFieldsetTraiter(value: 'traiter' | 'cloturer') {
        if (value === 'traiter') {
            this.formTraitementMasse
                .get('sims_file')
                ?.setValidators([Validators.required]);
        } else {
            this.formTraitementMasse.get('sims_file')?.clearValidators();
            this.formTraitementMasse.get('sims_file')?.disabled;
        }
        this.formTraitementMasse.get('sims_file')?.updateValueAndValidity();
    }

    private isRequiredCommenatire(value: 'oui' | 'non') {
        if (value === 'non') {
            this.croixRougeCommentaire = true;
            this.formTraitementMasse
                .get('commentaire')
                ?.setValidators([Validators.required]);
        } else {
            this.croixRougeCommentaire = false;
            this.formTraitementMasse.get('commentaire')?.clearValidators();
            this.formTraitementMasse.get('commentaire')?.disabled;
        }
        this.formTraitementMasse.get('commentaire')?.updateValueAndValidity();
    }

    private isRequiredFieldsetAccepte(value: 'traiter' | 'cloturer') {
        if (value === 'cloturer') {
            this.formTraitementMasse
                .get('accepte')
                ?.setValidators([Validators.required]);
        } else {
            this.formTraitementMasse.get('accepte')?.clearValidators();
            this.formTraitementMasse.get('accepte')?.disabled;
        }
        this.formTraitementMasse.get('accepte')?.updateValueAndValidity();
    }

    public getLabelForm() {
        if (
            this.listDemandes.statut === this.stateSoumis ||
            this.listDemandes.traitement === this.treatmenEntente
        ) {
            return 'Modifier';
        }
        return 'Enregistrer';
    }

    public displayButtonForm() {
        if (
            this.listDemandes?.statut === this.stateCloture ||
            this.listDemandes?.statut !== 'en-traitement'
        ) {
            return true;
        }
        return false;
    }

    async getAllProduits(dataToSend: Object = this.demande?.numero_demande) {
        const response: any = await handle(
            () =>
                this.supervisionOperationService.postCommandeProduitCommandesDetails(
                    dataToSend
                ),
            this.toastrService,
            this.loadingBarService
        );
        this.listDemandes = response?.data;
        this.initFormTraitementMasse();
        this.IsLoading.emit(false);
    }

    async GetSupervisionOperationsDemandesServicesDetails(
        dataToSend = this.demande?.numero_demande
    ): Promise<void> {
        // this.response = await handle(() => this.settingService.GetSupervisionOperationsDemandesServicesDetails(dataToSend), this.toastrService, this.loadingBarService);
        // this.listDemandes = this.response?.data;
        // this.initFormTraitementMasse();
        // this.IsLoading.emit(false);
    }

    async onSaveDemandes(dataToSend: {}): Promise<void> {
        dataToSend = {
            sims_file: this.formTraitementMasse.value.sims_file,
            numero_demande: this.listDemandes?.numero_demande,
        };
        const htmlMessage = `Voulez-vous identifier la demande ?`;
        const result = await Swal.fire({
            ...SWALWITHBOOTSTRAPBUTTONSPARAMS.message,
            html: htmlMessage,
        });
        if (result.isConfirmed) {
            const response: any = await handle(
                () =>
                    this.supervisionOperationService.PostSupervisionOperationsTraitementsSuivisIdentificationsSims(
                        FormatFormData(dataToSend)
                    ),
                this.toastrService,
                this.loadingBarService
            );
            if (response?.error === false) this.successHandle(response);
        }
    }
    async onSaveTraitements(dataToSend: {}): Promise<void> {
        dataToSend = {
            accepte: this.formTraitementMasse.value.accepte,
            numero_demande: this.listDemandes?.numero_demande,
            commentaire: this.formTraitementMasse?.value?.commentaire,
            notation_cloture: this.formTraitementMasse?.value?.notation_cloture,
        };
        const htmlMessage = `Voulez-vous clôturer la demande ?`;
        const result = await Swal.fire({
            ...SWALWITHBOOTSTRAPBUTTONSPARAMS.message,
            html: htmlMessage,
        });
        if (result.isConfirmed) {
            const response: any = await handle(
                () =>
                    this.supervisionOperationService.PostSupervisionOperationsTraitementsSuivisCloturerDemandeService(
                        FormatFormData(dataToSend)
                    ),
                this.toastrService,
                this.loadingBarService
            );
            if (response?.error === false) this.successHandle(response);
        }
    }

    onLetDownDemands(
        dataToSend = { numero_demande: this.listDemandes?.numero_demande }
    ) {
        Swal.mixin({ ...SWALWITHBOOTSTRAPBUTTONSPARAMS.customClass })
            .fire({
                title: "Vous êtes sur le point d'abandonner la demande",
                input: 'text',
                inputPlaceholder: 'Ex: Commentez...',
                inputAttributes: {
                    autocapitalize: 'off',
                },
                showCancelButton: true,
                cancelButtonText: 'Annuler        ',
                confirmButtonText: 'Confirmer',
                showLoaderOnConfirm: true,
                preConfirm: async (commentaire) => {
                    try {
                        this.response = await handle(
                            () =>
                                this.supervisionOperationService.PostSupervisionOperationsTraitementsSuivisAbandonnerDemandeService(
                                    { ...dataToSend, commentaire: commentaire }
                                ),
                            this.toastrService,
                            this.loadingBarService
                        );
                        if (!this.response.ok) {
                            // return Swal.showValidationMessage(`${JSON.stringify(await this.response.message)}`);
                            if (!this.response?.error)
                                this.successHandle(this.response);
                        }
                        // return this.response.message;
                    } catch (error) {
                        Swal.showValidationMessage(`Une erreur s'est produite`);
                    }
                },
                allowOutsideClick: () => !Swal.isLoading(),
            })
            .then((result) => {
                if (result.isConfirmed) {
                    // this.successHandle(this.response);
                }
            });
    }

    private successHandle(response) {
        this.toastrService.success(response?.message);
        this.handleCloseModal();
        this.sharedDataService.sendPatrimoineSimDemandesServicesAll();
        this.sharedDataService.sendPatrimoineSimTraitementsDemandesAll();
        this.sharedDataService.sendPatrimoineSimDemandeIntegrationsAll();
    }

    public handleCloseModal(): void {
        this.activeModal.close();
    }

    public OnGetRapportCodeStyle(data: any): string {
        return getRapportCodeStyle(data);
    }

    public pushCurrentArrayForm(file_upload) {
        this.formTraitementMasse
            .get('sims_file')
            ?.patchValue(file_upload.sims_file);
    }

    public downloadFile(typeFile: 'justificatif' | 'recu_paiement') {
        const File: Record<'justificatif' | 'recu_paiement', string> = {
            justificatif: this.listDemandes?.justificatif,
            recu_paiement: this.listDemandes?.recu_paiement,
        };

        if (File[typeFile]) {
            window.open(File[typeFile], '_blank');
        } else {
            this.toastrService.warning('Type non deffini ' + typeFile);
        }
    }

    public displayBoutonJustificatif(): boolean {
        return this.listDemandes?.justificatif ? true : false;
    }

    public displayBoutonRecuPaiement(): boolean {
        return this.listDemandes?.type_paiement === 'différé' ? true : false;
    }

    async onDownloadModel(): Promise<any> {
        const tokenUser = JSON.parse(this.storage.getData('user')).token;
        if (this.listDemandes.operation === this.TYPE_FORM.ACTIVATION) {
            window.location.href =
                this.supervisionOperationService.GetSupervisionOperationsTraitementsSuivisDownloadModeleData(
                    this.TYPE_FORM.ACTIVATION_EN_MASSE,
                    this.listDemandes?.['numero_demande'],
                    tokenUser
                );
        } else {
            // window.location.href = this.supervisionOperationService.GetGestionTransactionsTraitementsServicesDownloadAbonnementsData(this.listDemandes.numero_demande, tokenUser);
        }
    }

    public canIdentify(demande: any): boolean {
        return (
            (demande?.etat_traitement === 'partiel' ||
                demande?.etat_traitement === 'total') &&
            demande?.etat_finalisation === 'clôturé'
        );
    }
}
