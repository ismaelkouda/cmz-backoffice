import {
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LOGO_IMAKO } from '../../constants/logoOrange.constant';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { SWALWITHBOOTSTRAPBUTTONSPARAMS } from '../../constants/swalWithBootstrapButtonsParams.constant';
import { BADGE_ETAT } from '../../constants/badge-etat.contant';
import { REQUESTS_SERVICE } from '../../routes/routes';
import { Subject, takeUntil } from 'rxjs';
import {
    REQUESTS_SERVICE_BUTTONS_ACTIONS_ENUM,
    T_REQUESTS_SERVICE_BUTTONS_ACTIONS_ENUM,
} from '../../../presentation/pages/requests-service/data-access/requests-service/enums/requests-service-buttons-actions.enum';
import { InvoiceFormApiService } from './data-access/services/invoice-form-api.service';
import {
    T_TYPE_CUSTOMERS_ENUM,
    TYPE_CUSTOMERS_ENUM,
} from '../../enum/type-customers.enum';
import { TranslateService } from '@ngx-translate/core';
import { FormatFormData } from '../../functions/formatFormData.function';
import { CUSTOMERS_ACTIVATE_STATE_ENUM } from '../../../presentation/pages/requests-service/data-access/customers-activate/enums/customers-activate-state.enum';
import { InvoiceFormDetailsInterface } from './data-access/interfaces/invoice-form-details.interface';
const Swal = require('sweetalert2');
import html2pdf from 'html2pdf.js';
import { InvoicePdfService } from './data-access/services/invoice-pdf.service';
import { CustomersActivateNavigationGuardService } from '../../../presentation/pages/requests-service/data-access/customers-activate/services/customers-activate-navigation-guard.service';

export interface InvoiceFormInterfaceValues {
    numero_demande: FormControl<string>;
    justificatif: FormControl<File | null>;
}

@Component({
    selector: 'app-invoice-form',
    templateUrl: './invoice-form.component.html',
    styleUrls: [`./invoice-form.component.scss`],
})
export class InvoiceFormComponent implements OnInit, OnDestroy {
    @ViewChild('fileInput') fileInput!: ElementRef;
    public module: string;
    public subModule: string;
    public invoiceForm: FormGroup;
    private id: string;
    private type_enterprise: T_TYPE_CUSTOMERS_ENUM;
    private ref: T_REQUESTS_SERVICE_BUTTONS_ACTIONS_ENUM;
    public customerDetails: InvoiceFormDetailsInterface;

    public logoTenant: string;
    public BADGE_ETAT = BADGE_ETAT;
    public uploadedFileName: string | null = null;
    public uploadError: string | null = null;
    readonly MAX_FILE_SIZE_MB = 2;
    private destroy$ = new Subject<void>();

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private toastService: ToastrService,
        private fb: FormBuilder,
        private translate: TranslateService,
        private invoiceFormApiService: InvoiceFormApiService,
        private invoicePdfService: InvoicePdfService,
        private navigationGuardService: CustomersActivateNavigationGuardService
    ) {
        this.logoTenant = LOGO_IMAKO;
    }

    ngOnInit(): void {
        this.initializeState();
    }

    private initializeState(): void {
        this.activatedRoute.data.subscribe((data) => {
            this.module = data.module;
            this.subModule = data.subModule[0];
        });

        this.activatedRoute.queryParams.subscribe((params) => {
            this.validateParams(params);
        });
    }

    private validateParams(params: {
        ref?: T_REQUESTS_SERVICE_BUTTONS_ACTIONS_ENUM;
        id?: string;
        type_enterprise?: T_TYPE_CUSTOMERS_ENUM;
    }): void {
        if (
            !Object.values(TYPE_CUSTOMERS_ENUM).includes(
                params.type_enterprise as T_TYPE_CUSTOMERS_ENUM
            )
        ) {
            this.router.navigate(['customers-activate']);
            return;
        }
        if (
            !Object.values(REQUESTS_SERVICE_BUTTONS_ACTIONS_ENUM).includes(
                params.ref as T_REQUESTS_SERVICE_BUTTONS_ACTIONS_ENUM
            )
        ) {
            this.router.navigate(['customers-activate']);
            return;
        }

        this.type_enterprise = params.type_enterprise as T_TYPE_CUSTOMERS_ENUM;
        this.ref = params.ref as T_REQUESTS_SERVICE_BUTTONS_ACTIONS_ENUM;
        this.id = this.activatedRoute.snapshot.paramMap.get('id') ?? '';
        this.loadCustomerDetails();
    }

    private loadCustomerDetails(): void {
        this.invoiceFormApiService.fetchRequestsServiceDetails(this.id);

        this.invoiceFormApiService
            .getRequestsServiceDetails()
            .pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                this.customerDetails = value;
                this.initializeForm();
            });
    }

    public initializeForm(): void {
        const disabled = !this.disabledEditableForm;

        this.invoiceForm = this.fb.group({
            numero_demande: new FormControl(
                { value: this.id ?? '', disabled },
                { nonNullable: true, validators: [Validators.required] }
            ),
            justificatif: new FormControl<File | null>(null, {
                nonNullable: true,
                validators: [Validators.required],
            }),
        });
    }
    onChangeFile(
        list: FileList | null,
        fieldName: keyof InvoiceFormInterfaceValues
    ): void {
        this.uploadError = null;

        if (!list || list.length === 0) {
            this.clearFileInput(fieldName);
            return;
        }
        const file = list.item(0) as File;

        if (!this.isValidFileType(file)) {
            this.uploadError = this.translate.instant('INVALID_FILE_FORMAT');
            this.toastService.error(this.uploadError as string);
            this.clearFileInput(fieldName);
            return;
        }

        if (!this.isValidFileSize(file)) {
            this.uploadError = this.translate.instant('INVALID_FILE_SIZE', {
                maxSize: this.MAX_FILE_SIZE_MB,
            });
            this.toastService.error(this.uploadError as string);
            this.clearFileInput(fieldName);
            return;
        }

        this.processValidFile(file, fieldName);
    }

    private isValidFileType(file: File): boolean {
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        return allowedTypes.includes(file.type);
    }

    private isValidFileSize(file: File): boolean {
        const fileSizeMB = file.size / (1024 * 1024);
        return fileSizeMB <= this.MAX_FILE_SIZE_MB;
    }

    private processValidFile(
        file: File,
        fieldName: keyof InvoiceFormInterfaceValues
    ): void {
        this.invoiceForm.patchValue({ [fieldName]: file });
        this.invoiceForm.get(fieldName)?.updateValueAndValidity();
        this.uploadedFileName = file.name;

        // this.convertFileToBase64(file).then(base64 => {
        //     if (fieldName === 'justificatif' && this.customerDetails) {
        //         console.log('File converted to base64:', base64);
        //         this.customerDetails.justificatif = base64;
        //     }
        // });

        this.toastService.success(
            this.translate.instant('FILE_UPLOAD_SUCCESS')
        );
    }

    private async convertFileToBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e: any) => resolve(e.target.result);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    }

    clearFileInput(fieldName: keyof InvoiceFormInterfaceValues): void {
        this.invoiceForm.get(fieldName)?.reset();
        this.invoiceForm.get(fieldName)?.updateValueAndValidity();
        this.uploadedFileName = null;
        this.uploadError = null;

        if (this.fileInput?.nativeElement) {
            this.fileInput.nativeElement.value = '';
        }
        if (this.fileInput?.nativeElement) {
            console.log('File input cleared', this.fileInput.nativeElement);
        }
    }

    public viewFile(field: string) {
        const file = this.invoiceForm.get(field)?.value as File | null;
        const defaultFile = this.customerDetails.justificatif;
        if (!file && !defaultFile) {
            this.toastService.info('Aucun fichier à afficher');
            return;
        }
        if (file) window.open(URL.createObjectURL(file as File), '_blank');
        if (defaultFile) window.open(defaultFile, '_blank');
    }

    public onGoToBack(): void {
        this.navigationGuardService.clearCustomersActivateNavigationGuard();
        this.router.navigateByUrl(
            `/${this.getTitle.moduleRoute}/${this.getTitle.subModuleRoute}`
        );
    }

    isInvalid(path): boolean {
        const ctrl = this.invoiceForm.get(path as string);
        return !!ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched);
    }

    private buildPayload(): FormData {
        const v = this.invoiceForm.getRawValue();
        const fd = FormatFormData(v);
        return fd;
    }

    public async handleTreatmentPayment(): Promise<void> {
        // if (!!this.ref.includes(INVOICE_FORM_TREATMENT_ENUM.INVOICE) !== INVOICE_FORM_TREATMENT_ENUM.INVOICE) {
        //     this.toastService.warning('Modification non autorisée');
        //     return;
        // }
        if (this.invoiceForm.invalid) {
            this.toastService.error('Formulaire invalide');
            return;
        }
        const payload: FormData = this.buildPayload();

        const INVOICE_AMOUNT_NOTICE = this.translate.instant(
            'INVOICE_AMOUNT_NOTICE'
        );

        const result = await Swal.mixin({
            customClass: SWALWITHBOOTSTRAPBUTTONSPARAMS.customClass,
        }).fire({
            ...SWALWITHBOOTSTRAPBUTTONSPARAMS.message,
            html: INVOICE_AMOUNT_NOTICE,
            width: 800,
        });

        if (result.isConfirmed) {
            this.invoiceFormApiService.fetchValidateProformaService(
                payload,
                this.id,
                this.toastService,
                () => {
                    this.onGoToBack();
                }
            );
        }
    }
    public get disabledEditableForm(): boolean {
        return (
            this.customerDetails?.traitement ===
            CUSTOMERS_ACTIVATE_STATE_ENUM.IN_WAITING
        );
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public get displayButtonShowPaymentReceipt(): boolean {
        return !!this.invoiceForm?.['recu_paiement'];
    }

    public postExportInvoice(): void {
        // this.exportInvoiceService.handleExportInvoice(this.invoiceForm);
    }

    downloadInvoice() {
        this.invoicePdfService.generateInvoice(
            this.customerDetails,
            this.logoTenant,
            this.customerDetails.facture?.qrcode
        );
        // const element = document.getElementById('print-section');
        // const opt = {
        //   margin:       0.5,
        //   filename:     'facture.pdf',
        //   image:        { type: 'jpeg', quality: 0.98 },
        //   html2canvas:  { scale: 2 },
        //   jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
        // };
        // if (element) {
        //   html2pdf().from(element).set(opt).save();
        // }
    }

    get getTitle(): {
        module: string;
        moduleRoute: string;
        subModule: string;
        subModuleRoute: string;
    } {
        switch (this.ref) {
            case REQUESTS_SERVICE_BUTTONS_ACTIONS_ENUM.INVOICE:
                return {
                    module: 'REQUESTS_SERVICE',
                    moduleRoute: REQUESTS_SERVICE,
                    subModule: 'CUSTOMERS_ACTIVATE',
                    subModuleRoute: 'mobile-subscriptions',
                };
            case REQUESTS_SERVICE_BUTTONS_ACTIONS_ENUM.PAYMENT:
                return {
                    module: 'REQUESTS_SERVICE',
                    moduleRoute: REQUESTS_SERVICE,
                    subModule: 'CUSTOMERS_ACTIVATE',
                    subModuleRoute: 'mobile-subscriptions',
                };
            // case 'invoice-white-sim':
            //     return {
            //         module: 'REQUESTS_PRODUCTS',
            //         moduleRoute: REQUESTS_PRODUCTS,
            //         subModule: 'WHITE_SIM',
            //         subModuleRoute: 'white-sim',
            //     };
            // case 'payment-white-sim':
            //     return {
            //         module: 'REQUESTS_PRODUCTS',
            //         moduleRoute: REQUESTS_PRODUCTS,
            //         subModule: 'WHITE_SIM',
            //         subModuleRoute: 'white-sim',
            //     };
            // case 'invoice':
            //     return {
            //         module: 'ACCOUNTING',
            //         moduleRoute: ACCOUNTING,
            //         subModule: 'MY_INVOICES',
            //         subModuleRoute: 'my-invoices',
            //     };
            // case 'invoice-my-paiements':
            //     return {
            //         module: 'ACCOUNTING',
            //         moduleRoute: ACCOUNTING,
            //         subModule: 'MY_PAYMENTS',
            //         subModuleRoute: 'my-payments',
            //     };
            // case 'invoice-claims':
            //     return {
            //         module: 'OVERSEEING_OPERATIONS',
            //         moduleRoute: 'OVERSEEING_OPERATIONS',
            //         subModule: 'MY_CLAIMS',
            //         subModuleRoute: 'CLAIMS',
            //     };

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
