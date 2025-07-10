import { FormatFormData } from 'src/shared/functions/formatFormData.function';
import { Pargination } from '../../table/pargination';
import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { BADGE_ETAT_FACTURE } from '../../constants/badge-etat-facture.contant';
import { SharedService } from '../../services/shared.service';
import {
    ACCOUNTING,
    REQUESTS_PRODUCTS,
    REQUESTS_SERVICES,
} from '../../routes/routes';
import { DetailsDemand } from '../form-folder/data-access/form-folder.interface';
import { ExportInvoiceService } from './data-access/enums/export-invoice.service';
import {
    PAYMENT_STATUS_ENUM,
    T_PAYMENT_STATUS_ENUM,
} from '../../../presentation/pages/accounting/data-access/payment/enums/payment-status.enum';
import { TypePayment } from '../../enum/type-payment.enum';
import { CurrentUser } from '../../interfaces/current-user.interface';
import {
    OperationTransaction,
    TitleOperation,
} from '../../enum/OperationTransaction.enum';
import { Subject, takeUntil } from 'rxjs';
import { EncodingDataService } from '../../services/encoding-data.service';
const Swal = require('sweetalert2');

type TYPEVIEW =
    | 'invoice-mobile-subscription'
    | 'payment-mobile-subscription'
    | 'invoice-white-sim'
    | 'payment-white-sim'
    | 'invoice-my-paiements'
    | 'invoice'
    | 'payment'
    | 'invoice-claims';
const TYPEVIEW_VALUES: TYPEVIEW[] = [
    'invoice-mobile-subscription',
    'payment-mobile-subscription',
    'invoice-white-sim',
    'payment-white-sim',
    'invoice-my-paiements',
    'invoice',
    'payment',
    'invoice-claims',
];
function isTypeView(value: any): value is TYPEVIEW {
    return TYPEVIEW_VALUES.includes(value);
}
type TYPE_COLOR_PAYMENT_STATUS_BADGE =
    | 'badge-dark'
    | 'badge-warning'
    | 'badge-primary'
    | 'badge-success'
    | 'badge-danger';
@Component({
    selector: 'app-invoice-form',
    templateUrl: './invoice-form.component.html',
    styleUrls: [`./invoice-form.component.scss`],
})
export class InvoiceFormComponent implements OnInit, OnDestroy {
    public spinner: boolean = true;
    public module: string;
    public subModule: string;
    public pargination = new Pargination(1, 50, 0, 0, 0, 1, 0);
    public urlParamRef: TYPEVIEW;
    public urlParamNumeroDemande: string | null;
    public urlParamFilter: Object;
    public urlParamCurrentPage: string;
    public urlParamOperation: string;
    public detailsInvoiceForm: DetailsDemand | null = null;
    public displayUrlErrorPage: boolean = false;
    public logoTenant: string;
    public BADGE_ETAT = BADGE_ETAT;
    public formTypePaiement: FormGroup;
    public TypePayment = TypePayment;
    public url_minio: string;
    public uploadedFileName: string | null = null;
    public uploadError: string | null = null;
    readonly MAX_FILE_SIZE_MB = 2;
    private destroy$ = new Subject<void>();

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private toastrService: ToastrService,
        private loadingBarService: LoadingBarService,
        private sharedDataService: SharedDataService,
        private sharedService: SharedService,
        private fb: FormBuilder,
        private supervisionOperationService: SupervisionOperationService,
        private exportInvoiceService: ExportInvoiceService,
        private encodingService: EncodingDataService
    ) {
        this.logoTenant = LOGO_ORANGE;
    }

    ngOnInit(): void {
        const user = this.encodingService.getData(
            'user_data'
        ) as CurrentUser | null;
        this.url_minio = user?.tenant.url_minio as string;
        this.getParamsInUrl();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
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
            this.sharedService.fetchDetailsDemand(
                this.urlParamNumeroDemande,
                this.urlParamRef
            );
            this.sharedService.getDetailsDemand().subscribe((value) => {
                this.detailsInvoiceForm = value;
                this.initFormTypePaiement();
                this.spinner = false;
            });
        }
    }

    public onUploadPaymentReceipt(files: FileList) {
        this.uploadError = null;

        if (files && files.length > 0) {
            const file = files[0];
            const fileSizeMB = file.size / (1024 * 1024);

            if (fileSizeMB > this.MAX_FILE_SIZE_MB) {
                this.uploadError = `Taille maximale autorisée (${this.MAX_FILE_SIZE_MB} Mo).`;
                return;
            }
            console.log('files.item(0)', files.item(0));

            this.formTypePaiement.patchValue({ recu_paiement: files.item(0) });
        }
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
                this.detailsInvoiceForm?.['numero_demande'],
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
            if (value === 'PrePaid') {
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
        return this.detailsInvoiceForm?.statut === BADGE_ETAT_FACTURE.SOLDEE;
    }
    public get displayInputUploadPaymentReceipt(): boolean {
        return this.detailsInvoiceForm?.statut === BADGE_ETAT_FACTURE.SOLDEE;
    }
    public get isDeferred(): boolean {
        return this.detailsInvoiceForm?.statut === BADGE_ETAT_FACTURE.REPORTEE;
    }

    public get isApprouved(): boolean {
        return this.detailsInvoiceForm?.etat_facture === BADGE_ETAT.APPROUVE;
    }

    public get isPosted(): boolean {
        return this.detailsInvoiceForm?.statut === BADGE_ETAT_FACTURE.POSTEE;
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
    async handleTreatmentPayment(
        dataToSend = { ...this.formTypePaiement.value }
    ): Promise<void> {
        // if(this.formTypePaiement.invalid || this.isSold()) {}
        let htmlMessage: string;
        switch (this.formTypePaiement.get('type_paiement')?.value) {
            case 'PostPaid':
                htmlMessage = `<span style="color: #ff6600;">Le montant de cette facture sera <strong>enregistré dans le système de facturation</strong>. Le règlement s'effectuera ultérieurement selon les conditions convenues.</span>`;
                break;

            case 'PrePaid':
                htmlMessage = `<span style="color: #ff6600;">Cette facture sera <strong>réglée immédiatement</strong> via un justificatif de paiement.</span>`;
                break;

            case 'via Compte':
                htmlMessage = `</span>Le montant <span style="color: #ff6600;"><strong>${this.detailsInvoiceForm?.['prix_ttc']}</strong></span> sera <strong>débité de votre compte</strong>.`;
                break;

            default:
                this.toastrService.warning('Type de paiement non reconnu.');
                return;
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

    public getStatePaymentBadge(selectedPayment?: {
        etat_paiement: T_PAYMENT_STATUS_ENUM;
    }): TYPE_COLOR_PAYMENT_STATUS_BADGE {
        if (!selectedPayment || !selectedPayment.etat_paiement) {
            return 'badge-dark';
        }

        const stateMap: Record<
            T_PAYMENT_STATUS_ENUM,
            TYPE_COLOR_PAYMENT_STATUS_BADGE
        > = {
            [PAYMENT_STATUS_ENUM.UNKNOWN]: 'badge-dark',
            [PAYMENT_STATUS_ENUM.POSTED]: 'badge-warning',
            [PAYMENT_STATUS_ENUM.ABANDONED]: 'badge-warning',
            [PAYMENT_STATUS_ENUM.VALIDATED]: 'badge-success',
            [PAYMENT_STATUS_ENUM.RESULTED]: 'badge-success',
            [PAYMENT_STATUS_ENUM.NO_RESULTED]: 'badge-danger',

            [PAYMENT_STATUS_ENUM.WAITING]: 'badge-dark',
            [PAYMENT_STATUS_ENUM.REPORTED]: 'badge-primary',
            [PAYMENT_STATUS_ENUM.REJECTED]: 'badge-danger',
        };

        return stateMap[selectedPayment.etat_paiement];
    }

    public postExportInvoice(): void {
        this.exportInvoiceService.handleExportInvoice(this.detailsInvoiceForm);
    }

    public getTitleForm(operation: OperationTransaction): string {
        const titleOp = new TitleOperation();
        titleOp.setTitleForm(operation);
        return titleOp.getTitleForm;
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
            case 'invoice-mobile-subscription':
                return {
                    module: 'REQUESTS_SERVICES',
                    moduleRoute: REQUESTS_SERVICES,
                    subModule: 'MOBILE_SUBSCRIPTIONS',
                    subModuleRoute: 'mobile-subscriptions',
                };
            case 'payment-mobile-subscription':
                return {
                    module: 'REQUESTS_SERVICES',
                    moduleRoute: REQUESTS_SERVICES,
                    subModule: 'MOBILE_SUBSCRIPTIONS',
                    subModuleRoute: 'mobile-subscriptions',
                };
            case 'invoice-white-sim':
                return {
                    module: 'REQUESTS_PRODUCTS',
                    moduleRoute: REQUESTS_PRODUCTS,
                    subModule: 'WHITE_SIM',
                    subModuleRoute: 'white-sim',
                };
            case 'payment-white-sim':
                return {
                    module: 'REQUESTS_PRODUCTS',
                    moduleRoute: REQUESTS_PRODUCTS,
                    subModule: 'WHITE_SIM',
                    subModuleRoute: 'white-sim',
                };
            case 'invoice':
                return {
                    module: 'ACCOUNTING',
                    moduleRoute: ACCOUNTING,
                    subModule: 'MY_INVOICES',
                    subModuleRoute: 'my-invoices',
                };
            case 'invoice-my-paiements':
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
