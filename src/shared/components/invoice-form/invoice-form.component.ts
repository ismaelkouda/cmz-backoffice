import { FormatFormData } from 'src/shared/functions/formatFormData.function';
import { Pargination } from '../../table/pargination';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { SharedDataService } from '../../services/shared-data.service';
import { LOGO_ORANGE } from '../../constants/logoOrange.constant';
import { handle } from '../../functions/api.function';
import { SupervisionOperationService } from '../../../presentation/pages/supervision-operations/data-access/supervision-operation.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SWALWITHBOOTSTRAPBUTTONSPARAMS } from '../../constants/swalWithBootstrapButtonsParams.constant';
import { BADGE_ETAT } from '../../constants/badge-etat.contant';
import {
    BADGE_ETAT_FACTURE,
    T_BADGE_ETAT_FACTURE,
} from '../../constants/badge-etat-facture.contant';
import { SharedService } from '../../services/shared.service';
import { ACCOUNTING } from '../../routes/routes';
// import {
//     INVOICE,
//     PAYMENT,
// } from '../../../presentation/pages/accounting/accounting-routing.module';
import { DetailsDemand } from '../form-folder/data-access/form-folder.interface';
// import { CLAIMS } from '../../../presentation/pages/overseeing-operations/overseeing-operations-routing.module';
const Swal = require('sweetalert2');

type TYPEVIEW = 'view-invoice' | 'view-payment' | 'invoice-claims';
const TYPEVIEW_VALUES: TYPEVIEW[] = [
    'view-invoice',
    'view-payment',
    'invoice-claims',
];
function isTypeView(value: any): value is TYPEVIEW {
    return TYPEVIEW_VALUES.includes(value);
}
type TYPE_COLOR_ETAT_BADGE =
    | 'badge-warning'
    | 'badge-dark'
    | 'badge-success'
    | 'badge-danger'
    | 'badge-primary';
@Component({
    selector: 'app-invoice-form',
    templateUrl: './invoice-form.component.html',
    styleUrls: [`./invoice-form.component.scss`],
})
export class InvoiceFormComponent {
    public spinner: boolean = true;
    public module: string;
    public subModule: string;
    public pargination = new Pargination(1, 50, 0, 0, 0, 1, 0);
    public urlParamRef: TYPEVIEW;
    public urlParamNumeroDemande: string | null;
    public urlParamFilter: Object;
    public urlParamCurrentPage: string;
    public urlParamOperation: string;
    public detailsInvoiceForm: DetailsDemand;
    public displayUrlErrorPage: boolean = false;
    public logoTenant: string;
    public BADGE_ETAT = BADGE_ETAT;
    public formTypePaiement: FormGroup;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private toastrService: ToastrService,
        private loadingBarService: LoadingBarService,
        private sharedDataService: SharedDataService,
        private sharedService: SharedService,
        private fb: FormBuilder,
        private supervisionOperationService: SupervisionOperationService
    ) {
        this.logoTenant = LOGO_ORANGE;
    }

    ngOnInit(): void {
        this.getParamsInUrl();
    }

    private getParamsInUrl(): void {
        this.activatedRoute.queryParams.subscribe((params: Object) => {
            this.urlParamRef = params?.['ref'];
            this.urlParamCurrentPage = params?.['urlParamCurrentPage'];
            this.urlParamOperation = params?.['operation'];
        });
        this.urlParamNumeroDemande =
            this.activatedRoute.snapshot.paramMap.get('number_demand');
        // si la ref dans l'url est different de  "facture" alors affiche la page d'error
        if (!isTypeView(this.urlParamRef) || !this.urlParamNumeroDemande) {
            this.displayUrlErrorPage = true;
        } else {
            this.getTitle;
            this.sharedService.fetchDetailsDemand(this.urlParamNumeroDemande);
            this.sharedService.getDetailsDemand().subscribe((value) => {
                this.detailsInvoiceForm = value;
                this.initFormTypePaiement();
                this.spinner = false;
            });
        }
    }

    public onUploadPaymentReceipt(file: FileList) {
        this.formTypePaiement.patchValue({ recu_paiement: file.item(0) });
    }

    public onDownloadPaymentReceipt() {
        this.detailsInvoiceForm?.['recu_paiement']
            ? window.open(this.detailsInvoiceForm?.['recu_paiement'])
            : this.toastrService.error('Aucun reçu de paiement disponible');
    }

    public get displayButtonShowPaymentReceipt(): boolean {
        return this.detailsInvoiceForm?.['recu_paiement'] ? true : false;
    }

    public initFormTypePaiement(): void {
        this.formTypePaiement = this.fb.group({
            numero_demande: this.createFormControl(
                this.detailsInvoiceForm?.['facture']?.['numero_demande'],
                null,
                false
            ),
            operation: this.createFormControl(
                this.detailsInvoiceForm?.['operation'],
                null,
                true
            ),
            type_paiement: this.createFormControl(
                this.getNonNullValue(
                    this.detailsInvoiceForm?.['type_paiement']
                ),
                Validators.required,
                false
            ),
            recu_paiement: this.createFormControl(
                this.detailsInvoiceForm?.['recu_paiement'],
                null,
                false
            ),
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
        if (this.isDeferred) {
            this.formTypePaiement.get('type_paiement')?.reset();
        }
    }
    public get isSold(): boolean {
        return (
            this.detailsInvoiceForm?.['facture']?.statut ===
            BADGE_ETAT_FACTURE.SOLDEE
        );
    }
    public get displayInputUploadPaymentReceipt(): boolean {
        return (
            this.detailsInvoiceForm?.['facture']?.statut ===
            BADGE_ETAT_FACTURE.SOLDEE
        );
    }
    public get isDeferred(): boolean {
        return (
            this.detailsInvoiceForm?.['facture']?.statut ===
            BADGE_ETAT_FACTURE.REPORTEE
        );
    }

    public get isApprouved(): boolean {
        return (
            this.detailsInvoiceForm?.['facture']?.etat_facture ===
            BADGE_ETAT.APPROUVE
        );
    }

    public get isPosted(): boolean {
        return (
            this.detailsInvoiceForm?.['facture']?.statut ===
            BADGE_ETAT_FACTURE.POSTEE
        );
    }

    private getNonNullValue(value: any): string {
        return value === 'null' || value === null || value === undefined
            ? ''
            : value;
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
    async postTraitementsSuivisPaiementDemandeService(
        dataToSend = { ...this.formTypePaiement.value }
    ): Promise<void> {
        // if(this.formTypePaiement.invalid || this.isSold()) {}
        let htmlMessage: string;
        switch (this.formTypePaiement.get('type_paiement')?.value) {
            case 'immédiat':
                htmlMessage = `Le recu de paiement sera rattaché à la facture <span style="color: #ff6600;"><strong>${this.detailsInvoiceForm?.['facture']?.['numero_demande']}</strong></span> !`;
                break;
            case 'différé':
                htmlMessage = `Paiement différé !`;
                break;
            case 'mon compte':
                htmlMessage = `Le paiement de la facture <span style="color: #ff6600;"><strong>${this.detailsInvoiceForm?.['facture']?.['numero_demande']}</strong></span> a été débité de votre compte !`;
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

    private successHandle(response) {
        this.toastrService.success(response?.message);
        this.onGoToBack();
        this.sharedDataService.sendPatrimoineSimDemandesServicesAll();
        this.sharedDataService.sendPatrimoineSimTraitementsDemandesAll();
        this.sharedDataService.sendPatrimoineSimDemandeIntegrationsAll();
    }

    getStatutBadge(facture?: { statut?: T_BADGE_ETAT_FACTURE }): Object {
        if (!facture || !facture.statut) {
            return 'badge-dark';
        }

        const stateMap: Record<T_BADGE_ETAT_FACTURE, TYPE_COLOR_ETAT_BADGE> = {
            [BADGE_ETAT_FACTURE.EN_ATTENTE]: 'badge-dark',
            [BADGE_ETAT_FACTURE.POSTEE]: 'badge-warning',
            [BADGE_ETAT_FACTURE.REPORTEE]: 'badge-primary',
            [BADGE_ETAT_FACTURE.SOLDEE]: 'badge-success',
            [BADGE_ETAT_FACTURE.ABANDONNEE]: 'badge-warning',
            [BADGE_ETAT_FACTURE.REJETEE]: 'badge-danger',
        };

        return stateMap[facture.statut];
    }

    public formatTitle(title: string) {
        return this.supervisionOperationService.HandleFormatTitle(title);
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
            case 'view-invoice':
                return {
                    module: 'ACCOUNTING',
                    moduleRoute: ACCOUNTING,
                    subModule: 'MY_INVOICES',
                    subModuleRoute: 'my-invoice',
                };
            case 'view-payment':
                return {
                    module: 'ACCOUNTING',
                    moduleRoute: ACCOUNTING,
                    subModule: 'MY_PAYMENTS',
                    subModuleRoute: 'my-payments',
                };
            case 'invoice-claims':
                return {
                    module: 'OVERSEEING_OPERATIONS',
                    moduleRoute: 'OVERSEEING_OPERATIONS',
                    subModule: 'MY_CLAIMS',
                    subModuleRoute: 'CLAIMS',
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
