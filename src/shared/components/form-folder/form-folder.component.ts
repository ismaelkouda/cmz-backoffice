import { StatutTransaction } from 'src/shared/enum/StatutTransaction.enum';
import { FormatFormData } from 'src/shared/functions/formatFormData.function';
import { BADGE_STAUT_PAIEMENT } from './../../constants/badge-statut-paiement';
import { IFormFolderValues } from './data-access/form-folder-values.interface';
import { EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Component } from "@angular/core";
import { TreatmentDemands } from "../../interfaces/treatment-demands.interface";
import { getRapportCodeStyle } from "../../functions/rapport-code-style.function";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { SharedService } from "../../services/shared.service";
import { Folder } from "../../interfaces/folder";
import { DetailsDemand } from './data-access/form-folder.interface';
import { BADGE_ETAPE } from '../../constants/badge-etape.constant';
import { BADGE_ETAT } from '../../constants/badge-etat.contant';
import { SWALWITHBOOTSTRAPBUTTONSPARAMS } from '../../constants/swalWithBootstrapButtonsParams.constant';
import { handle } from '../../functions/api.function';
import { ToastrService } from 'ngx-toastr';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { SupervisionOperationService } from '../../../presentation/pages/supervision-operations/data-access/supervision-operation.service';
import { OperationTransaction } from '../../enum/OperationTransaction.enum';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest, Observable } from 'rxjs';
import { UsageInterface } from '../../interfaces/usage.interface';
const Swal = require('sweetalert2');

@Component({
    selector: "app-form-folder",
    templateUrl: "./form-folder.component.html",
    styleUrls: [`./form-folder.component.scss`]
})

export class FormFolderComponent implements OnInit {
    @Input() demandSelected: Folder;
    @Input() typeTreatment: TreatmentDemands;
    @Output() visibleFormDossier: EventEmitter<boolean> = new EventEmitter<boolean>();
    public BADGE_STAUT_PAIEMENT = BADGE_STAUT_PAIEMENT;
    public formTreatmentDemand!: FormGroup<IFormFolderValues>;
    public detailsDemand: DetailsDemand;
    public typeDemand = OperationTransaction;
    public BADGE_ETAPE = BADGE_ETAPE;
    public BADGE_ETAT = BADGE_ETAT;
    public listUsages$: Observable<Array<UsageInterface>>;
    public listFormulas: Array<any> = [];

    constructor(private sharedService: SharedService, private fb: FormBuilder,
        private toastrService: ToastrService, private loadingBarService: LoadingBarService,
        private supervisionOperationService: SupervisionOperationService,
        private translate: TranslateService) { }

    ngOnInit(): void {
        console.log('this.demandSelected', this.demandSelected)
        this.sharedService.fetchDetailsDemand(this.demandSelected?.numero_demande);
        this.sharedService.getDetailsDemand().subscribe((value) => {
            this.detailsDemand = value;
            this.initFormTreatmentMasse();
        });
        this.sharedService.fetchUsages();
        this.listUsages$ = this.sharedService.getUsages();
        this.sharedService.fetchFormulas();
        this.sharedService.getFormulas().subscribe((value) => {
            this.listFormulas = value;
        });
    }

    private initFormTreatmentMasse(): void {
        this.formTreatmentDemand = this.fb.group<IFormFolderValues>({
            formule_uuid: new FormControl<string>(
                this.isEditableForm ?
                    { value: this.detailsDemand?.formule_uuid, disabled: false } :
                    { value: this.detailsDemand?.formule, disabled: true },
                { validators: Validators.required, nonNullable: true }
            ),
            usage_id: new FormControl<string | number>(
                this.isEditableForm ?
                    { value: this.detailsDemand?.usage_id, disabled: false } :
                    { value: this.detailsDemand?.usage_nom, disabled: true },
                { validators: Validators.required, nonNullable: true }
            ),
            montant_formule: new FormControl<number>(
                { value: this.detailsDemand?.montant_formule, disabled: true },
                { nonNullable: true, validators: this.detailsDemand.operation === this.typeDemand.INTEGRATION ? Validators.required : null }
            ),
            description: new FormControl<string>(
                { value: this.detailsDemand?.description, disabled: false },
                { validators: Validators.required, nonNullable: true }
            ),
            accepte: new FormControl<string>(
                { value: this.detailsDemand?.etat_cloture, disabled: true },
                { nonNullable: true, validators: this.typeTreatment.cloturer ? Validators.required : null }
            ),
            commentaire: new FormControl<string>(
                this.detailsDemand?.commentaire_cloture,
                { nonNullable: true }
            ),
            sims_file: new FormControl<File | null>(
                null
            ),
            commentaire_traitement: new FormControl<string>(
                this.detailsDemand?.commentaire_traitement,
                { nonNullable: true }
            ),
            commentaire_finalisation: new FormControl<string>(
                this.detailsDemand?.commentaire_finalisation,
                { nonNullable: true }
            ),
            commentaire_cloture: new FormControl<string>(
                this.detailsDemand?.commentaire_cloture,
                { nonNullable: true }
            ),
            notation_cloture: new FormControl<string>(
                this.detailsDemand?.notation_cloture,
                { validators: this.isRequireNotationCloture ? Validators.required : null, nonNullable: true }
            ),
            operation: new FormControl<string>(
                { value: this.detailsDemand?.operation, disabled: true },
                { nonNullable: true }),
            nb_demande_soumises: new FormControl<number>(
                { value: this.detailsDemand?.nb_demande_soumises, disabled: true },
                { validators: [Validators.required, Validators.min(1), Validators.pattern(/^\d+(\.\d{1,2})?$/)], nonNullable: true }),
            prix_unitaire: new FormControl<number>(
                { value: this.detailsDemand?.facture?.prix_unitaire, disabled: true },
                { nonNullable: true }),
            prix_ht: new FormControl<number>(
                { value: this.detailsDemand?.facture?.prix_ht, disabled: true },
                { nonNullable: true }),
            prix_ttc: new FormControl<number>(
                { value: this.detailsDemand?.facture?.prix_ttc ?? 0, disabled: true },
                { nonNullable: true }),
            justificatif: new FormControl<File | null>(
                null,
                { nonNullable: true })
        });
        this.formTreatmentDemand.get('accepte')?.valueChanges.subscribe(this.handleAccepteChange.bind(this));

        if (this.typeTreatment.visualiser) {
            this.formTreatmentDemand.disable();
        }

        if (this.detailsDemand?.statut === StatutTransaction.TARITER) {
            this.updateFormForTraiteState();
        }
    }

    public onChangeFile(file: FileList) {
        const selectedFile = file.item(0);
        this.formTreatmentDemand.patchValue({ justificatif: selectedFile });
    }

    public get isEditableForm(): boolean {
        return this.typeTreatment.modifier;
    }

    private updateFormForTraiteState(): void {
        const operationControl = this.formTreatmentDemand.get('operation');
        operationControl?.patchValue('traiter');
        // this.isRequiredFieldsetTreat('traiter');
        this.isRequiredFieldsetDemand('traiter');
    }

    // private isRequiredFieldsetTreat(value: 'traiter' | 'cloturer') {
    //     if (value === 'traiter') {
    //         this.formTreatmentDemand.get("sims_file")?.setValidators([Validators.required]);
    //     } else {
    //         this.formTreatmentDemand.get("sims_file")?.clearValidators();
    //         this.formTreatmentDemand.get("sims_file")?.disabled;
    //     }
    //     this.formTreatmentDemand.get("sims_file")?.updateValueAndValidity();
    // }

    private isRequiredFieldsetDemand(value: 'traiter' | 'cloturer') {
        this.isRequiredFieldsetAccepte(value)
    }

    private isRequiredFieldsetAccepte(value: 'traiter' | 'cloturer') {
        if (value === 'cloturer') {
            this.formTreatmentDemand.get("accepte")?.setValidators([Validators.required]);
        } else {
            this.formTreatmentDemand.get("accepte")?.clearValidators();
            this.formTreatmentDemand.get("accepte")?.disabled;
        }
        this.formTreatmentDemand.get("accepte")?.updateValueAndValidity();
    }

    private handleAccepteChange(value: 'oui' | 'non'): void {
        this.isRequiredComment(value);
    }

    private isRequiredComment(value: 'oui' | 'non') {
        if (value === 'non') {
            this.formTreatmentDemand.get("commentaire")?.setValidators([Validators.required]);
        } else {
            this.formTreatmentDemand.get("commentaire")?.clearValidators();
            this.formTreatmentDemand.get("commentaire")?.disabled;
        }
        this.formTreatmentDemand.get("commentaire")?.updateValueAndValidity();
    }

    async onUpdateDemand(dataToSend: {}): Promise<void> {
        dataToSend = { sims_file: this.formTreatmentDemand.value.sims_file, numero_demande: this.detailsDemand?.numero_demande };
        const translatedMessage = this.translate.instant('WOULD_YOU_LIKE_TO_IDENTIFY_THE_REQUEST');
        const htmlMessage = `${translatedMessage} ?`;
        const result = await Swal.fire({ ...SWALWITHBOOTSTRAPBUTTONSPARAMS.message, html: htmlMessage })
        if (result.isConfirmed) {
            const response: any = await handle(() => this.supervisionOperationService.PostPatrimoineSimTransactionsSurSimUpdate(FormatFormData(dataToSend)), this.toastrService, this.loadingBarService);
            if (response?.error === false) this.successHandle(response);
        }
    }

    public formatTitle(title: string) {
        return this.supervisionOperationService.HandleFormatTitle(title);
    }

    public onLetDownDemand(dataToSend = { numero_demande: this.detailsDemand?.numero_demande }) {
        const YOU_ARE_ABOUT_TO_ABANDON_THE_REQUEST = this.translate.instant('YOU_ARE_ABOUT_TO_ABANDON_THE_REQUEST');
        const COMMENT = this.translate.instant('COMMENT');
        let response: any;
        Swal.mixin({ ...SWALWITHBOOTSTRAPBUTTONSPARAMS.customClass }).fire({
            title: "Êtes-vous sûr ?",
            html: `<h2 class="badge badge-success fs-4">${YOU_ARE_ABOUT_TO_ABANDON_THE_REQUEST} !</h2>`,
            input: 'text',
            inputPlaceholder: `Ex: ${COMMENT}...`,
            inputAttributes: { autocapitalize: 'off', autocomplete: 'off' },
            showCancelButton: true,
            cancelButtonText: "Annuler        ",
            confirmButtonText: "Confirmer",
            confirmButtonColor: "#569C5B",
            cancelButtonColor: "#dc3545",
            showLoaderOnConfirm: true,
            backdrop: false,
            width: 800,
            preConfirm: async (commentaire) => {
                try {
                    response = await handle(() => this.supervisionOperationService.PostSupervisionOperationsTraitementsSuivisAbandonnerDemandeService({ ...dataToSend, commentaire: commentaire }), this.toastrService, this.loadingBarService)
                    if (!response.ok) {
                        // return Swal.showValidationMessage(`${JSON.stringify(await response.message)}`);
                        if (!response?.error) this.successHandle(response)
                    }
                    // return response.message;
                } catch (error) {
                    const SOMETHING_WENT_WRONG = this.translate.instant('SOMETHING_WENT_WRONG');
                    Swal.showValidationMessage(`${SOMETHING_WENT_WRONG}`);
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {
                this.successHandle(response);
            }
        })
    }

    private successHandle(response) {
        this.toastrService.success(response?.message);
        this.handleCloseModal();
        // this.sharedDataService.sendPatrimoineSimDemandesServicesAll();
        // this.sharedDataService.sendPatrimoineSimTraitementsDemandesAll();
        // this.sharedDataService.sendPatrimoineSimDemandeIntegrationsAll();
        combineLatest([
            this.sharedService.getDataFilterDemands(),
            this.sharedService.getDataNbrPageDemands()
        ]).subscribe(([filterData, nbrPageData]) => {
            console.log('filterData', filterData)
            this.sharedService.fetchDemands(filterData, nbrPageData);
        });
        
    }

    public truncateString(str: string, maxLength: number = 20): string {
        if (str && str.length > maxLength) {
            return str.substring(0, maxLength) + '...';
        }
        return str || '';
    }

    public get dateSoumission(): string {
        const details = this.detailsDemand;
        if (!details) return '-- : --'; // Valeur par défaut pour éviter les erreurs

        switch (true) {
            case details.traitement === BADGE_ETAT.EN_ATTENTE:
                return details.created_at;
            case details.etat_soumission === BADGE_ETAT.RECU || details.etat_soumission === BADGE_ETAT.EN_COURS:
                return details.acquitte_a;
            case details.traitement === BADGE_ETAT.APPROUVE || details.traitement === BADGE_ETAT.REJETE:
                return details.approuve_a;
            default:
                return details.created_at;
        }
    }

    private get isRequireNotationCloture(): boolean {
        return this.demandSelected?.statut === BADGE_ETAPE.FINALISATEUR && this.demandSelected?.traitement === BADGE_ETAT.EFFECTUE
    }

    public get isApproved(): boolean {
        return this.detailsDemand?.accepte_approbation ? true : false;
    }

    public get OnGetRapportCodeStyle(): string {
        return getRapportCodeStyle(this.detailsDemand)
    }

    public displayBoutonProofPaiement(): boolean {
        return this.detailsDemand?.type_paiement === "différé";
    }

    public downloadFile(typeFile: 'justificatif' | 'recu-paiement') {
        switch (typeFile) {
            case 'justificatif': window.open(this.detailsDemand?.justificatif); break;
            case 'recu-paiement': window.open(this.detailsDemand?.recu_paiement); break;
        }
    }

    public get canIdentify(): boolean {
        return (this.detailsDemand?.etat_traitement === "partiel" || this.detailsDemand?.etat_traitement === "total") && this.detailsDemand?.etat_finalisation === "clôturé";
    }

    public handleCloseModal(): void {
        this.visibleFormDossier.emit(false);
    }
}