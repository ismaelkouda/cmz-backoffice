import { FormatFormData } from 'src/shared/functions/formatFormData.function';
import { SWALWITHBOOTSTRAPBUTTONSPARAMS } from './../../../../../shared/constants/swalWithBootstrapButtonsParams.constant';
import {
    OperationTransaction,
    TitleOperation,
} from './../../../../../shared/enum/OperationTransaction.enum';
import { SupervisionOperationService } from './../../../supervision-operations/data-access/supervision-operation.service';
import { handle } from 'src/shared/functions/api.function';
import { SharedDataService } from './../../../../../shared/services/shared-data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BADGE_ETAPE } from 'src/shared/constants/badge-etape.constant';
import { BADGE_ETAT } from 'src/shared/constants/badge-etat.contant';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SettingService } from '../../../../../shared/services/setting.service';
import { DemandesProduitsService } from '../../../demandes-produits/data-access/demandes-produits.service';
import { SharedService } from '../../../../../shared/services/shared.service';
const Swal = require('sweetalert2');

@Component({
    selector: `app-type-paiement`,
    templateUrl: `./type-paiement.component.html`,
    styleUrls: [`./type-paiement.component.scss`],
})
export class TypePaiementComponent implements OnInit {
    @Input() params:
        | { vue: 'abonnement'; action: 'Abandonner' | 'Identifier' }
        | { vue: 'sim-blanches'; action: 'Clôturer' };
    @Input() action: 'traiter' | 'cloturer' | 'Abandonner' | 'Traiter';
    @Input() IsLoadData;
    @Input() demandeSelected;
    @Output() IsLoading: EventEmitter<boolean> = new EventEmitter<boolean>();
    public detailsDemande: Object;
    public formTypePaiement: FormGroup;
    public BADGE_ETAT = BADGE_ETAT;
    public BADGE_ETAPE = BADGE_ETAPE;

    constructor(
        private toastrService: ToastrService,
        private loadingBarService: LoadingBarService,
        private fb: FormBuilder,
        private sharedDataService: SharedDataService,
        private supervisionOperationService: SupervisionOperationService,
        private activeModal: NgbActiveModal,
        private sharedService: SharedService
    ) {}

    ngOnInit(): void {
        if (this.params.vue === 'sim-blanches') {
            this.postCommandeProduitCommandesDetails();
        } else {
            this.sharedService.fetchDetailsDemand(
                this.demandeSelected['numero_demande']
            );
            this.sharedService.getDetailsDemand().subscribe((value) => {
                this.detailsDemande = value;
                this.initFormTypePaiement();
                this.IsLoading.emit(false);
            });
        }
        this.getTitleForm;
    }

    public truncateString(str: string, maxLength: number = 20): string {
        if (str && str.length > maxLength) {
            return str.substring(0, maxLength) + '...';
        }
        return str || '';
    }

    public initFormTypePaiement(): void {
        this.formTypePaiement = this.fb.group({
            source: this.createFormControl(
                this.detailsDemande?.['source'],
                null,
                true
            ),
            numero_demande: this.createFormControl(
                this.detailsDemande?.['numero_demande'],
                null,
                false
            ),
            operation: this.createFormControl(
                this.detailsDemande?.['operation'],
                null,
                true
            ),
            niveau_uns_uuid: this.createFormControl(
                this.detailsDemande?.['niveau_uns_nom'],
                null,
                true
            ),
            niveau_deux_uuid: this.createFormControl(
                this.detailsDemande?.['niveau_deux_nom'],
                null,
                true
            ),
            niveau_trois_uuid: this.createFormControl(
                this.detailsDemande?.['niveau_trois_nom'],
                null,
                true
            ),
            usage_id: this.createFormControl(
                this.detailsDemande?.['usage_nom'],
                null,
                true
            ),
            qte: this.createFormControl(
                this.detailsDemande?.['qte'],
                null,
                true
            ),
            prix_ht: this.createFormControl(
                this.detailsDemande?.['prix_ht'],
                null,
                true
            ),
            prix_ttc: this.createFormControl(
                this.detailsDemande?.['prix_ttc'],
                null,
                true
            ),
            formule_uuid: this.createFormControl(
                this.truncateString(this.detailsDemande?.['formule']),
                Validators.required,
                true
            ),
            description: this.createFormControl(
                this.detailsDemande?.['description'],
                null,
                true
            ),
            prix_unitaire: this.createFormControl(
                this.detailsDemande?.['prix_unitaire'],
                null,
                true
            ),
            montant: this.createFormControl(
                this.detailsDemande?.['montant'],
                null,
                true
            ),

            type_paiement: this.createFormControl(
                this.getNonNullValue(this.detailsDemande?.['type_paiement']),
                Validators.required,
                false
            ),
            recu_paiement: this.createFormControl(
                this.detailsDemande?.['recu_paiement'],
                null,
                false
            ),
            // justificatif: this.createFormControl(this.detailsDemande?.["justificatif"], null, false)
        });
        const typePaiementControl = this.formTypePaiement.get('type_paiement');
        const recuPaiementControl = this.formTypePaiement.get('recu_paiement');
        const gererValidationCommentaire = (value: string) => {
            if (value === 'immédiat') {
                recuPaiementControl?.setValidators([Validators.required]);
            } else {
                recuPaiementControl?.clearValidators();
            }
            recuPaiementControl?.updateValueAndValidity();
        };
        gererValidationCommentaire(typePaiementControl?.value);
        typePaiementControl?.valueChanges.subscribe((value) => {
            gererValidationCommentaire(value);
        });
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

    private getNonNullValue(value: any): string {
        return value === 'null' || value === null || value === undefined
            ? ''
            : value;
    }

    get getTitleForm(): string {
        const titleOp = new TitleOperation();
        titleOp.setTitleForm(this.demandeSelected['operation']);
        return titleOp.getTitleForm;
    }

    public displayBoutonJustificatif(): boolean {
        return this.detailsDemande?.['justificatif'] ? true : false;
    }

    public displayBoutonRecuPaiement(): boolean {
        return this.detailsDemande?.['recu_paiement'] ? true : false;
    }

    public downloadFile(typeFile: 'justificatif' | 'recu-paiement') {
        switch (typeFile) {
            case 'justificatif':
                window.open(this.detailsDemande?.['justificatif']);
                break;

            case 'recu-paiement':
                window.open(this.detailsDemande?.['recu_paiement']);
                break;
        }
    }

    async postCommandeProduitCommandesDetails(
        dataToSend = this.demandeSelected?.['numero_demande']
    ) {
        const response: any = await handle(
            () =>
                this.supervisionOperationService.postCommandeProduitCommandesDetails(
                    dataToSend
                ),
            this.toastrService,
            this.loadingBarService
        );
        this.detailsDemande = response?.data;
        this.initFormTypePaiement();
        this.IsLoading.emit(false);
    }
    // async GetSupervisionOperationsDemandesServicesDetails(dataToSend = this.demandeSelected["numero_demande"]): Promise<void> {
    //     const response: any = await handle(() => this.settingService.GetSupervisionOperationsDemandesServicesDetails(dataToSend), this.toastrService, this.loadingBarService);
    //     this.detailsDemande = response?.data;
    //     this.initFormTypePaiement();
    //     this.IsLoading.emit(false);
    // }
    async postTraitementsSuivisPaiementDemandeService(
        dataToSend = { ...this.formTypePaiement.value }
    ): Promise<void> {
        let htmlMessage: string;
        switch (this.formTypePaiement.get('type_paiement')?.value) {
            case 'immédiat':
                htmlMessage = `Le recu de paiement sera rattaché à la facture <span style="color: #ff6600;"><strong>${this.demandeSelected?.['numero_demande']}</strong></span> !`;
                break;
            case 'différé':
                htmlMessage = `Paiement différé !`;
                break;
            case 'mon compte':
                htmlMessage = `Le paiement de la facture <span style="color: #ff6600;"><strong>${this.demandeSelected?.['numero_demande']}</strong></span> a été débité de votre compte !`;
                break;

            default:
                htmlMessage = '';
                break;
        }
        const result = await Swal.mixin({
            customClass: SWALWITHBOOTSTRAPBUTTONSPARAMS.customClass,
        }).fire({
            ...SWALWITHBOOTSTRAPBUTTONSPARAMS.message,
            html: htmlMessage,
        });
        if (result.isConfirmed) {
            const response: any = await handle(
                () =>
                    this.supervisionOperationService.postGestionFacturePaiementsTransaction(
                        FormatFormData(dataToSend)
                    ),
                this.toastrService,
                this.loadingBarService
            );
            if (!response?.error) this.successHandle(response);
        }
    }

    public formatTitle(title: string) {
        return this.supervisionOperationService.HandleFormatTitle(title);
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
        if (
            data?.etat_soumission === BADGE_ETAT.RECU &&
            (data?.etat_cloture !== BADGE_ETAT.REFUSE ||
                data?.etat_cloture !== BADGE_ETAT.REJETE)
        ) {
            return 'detailsDemandeColorBlue';
        } else if (data?.etat_soumission === BADGE_ETAT.ABANDONNE) {
            return 'detailsDemandeColorYellow';
        } else if (
            data?.etat_traitement === BADGE_ETAT.REJETE ||
            data?.etat_cloture === BADGE_ETAT.REFUSE
        ) {
            return 'detailsDemandeColorRed';
        } else if (
            data?.etat_traitement === BADGE_ETAT.PARTIEL ||
            data?.etat_traitement === BADGE_ETAT.CLOTURE
        ) {
            return 'detailsDemandeColorGreen';
        } else {
            return 'detailsDemandeColorBlack';
        }
    }

    public onChangeFile(
        file: FileList,
        type: 'justificatif' | 'recu-paiement'
    ) {
        switch (type) {
            case 'justificatif':
                this.formTypePaiement.patchValue({
                    justificatif: file.item(0),
                });
                break;
            case 'recu-paiement':
                this.formTypePaiement.patchValue({
                    recu_paiement: file.item(0),
                });
                break;
        }
        this.formTypePaiement
            .get(type === 'justificatif' ? 'justificatif' : 'recu_paiement')
            ?.updateValueAndValidity();
    }
}
