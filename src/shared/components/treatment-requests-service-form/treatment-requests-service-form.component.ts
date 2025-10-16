import { IAddTreatmentRequestsServiceFormValues } from './data-access/interfaces/treatment-requests-service-form-values.interface';
import { CUSTOMERS_ACTIVATE_STATE_ENUM } from '../../../presentation/pages/requests-service/data-access/customers-activate/enums/customers-activate-state.enum';
import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { getRapportCodeStyle } from '../../functions/rapport-code-style.function';
import { filter, Observable, Subject, takeUntil } from 'rxjs';
import { TreatmentRequestsServiceDetailsInterface } from './data-access/interfaces/treatment-requests-service-form.interface';
import { SharedService } from '../../services/shared.service';
import { TreatmentRequestsServiceFormApiService } from './data-access/services/treatment-requests-service-form-api.service';
import { FormatFormData } from '../../functions/formatFormData.function';
const Swal = require('sweetalert2');
import { SWALWITHBOOTSTRAPBUTTONSPARAMS } from '../../constants/swalWithBootstrapButtonsParams.constant';
import { REQUESTS_SERVICE_TREATMENT_ENUM } from '../../../presentation/pages/requests-service/data-access/requests-service/enums/requests-service-treatment.enum';
import { WaitingQueueInterface } from '../../interfaces/waiting-queue.interface';
import { CustomersActivateInterface } from '../../interfaces/customers-activate.interface';
import { TreatmentMonitoringInterface } from '../../interfaces/treatment-monitoring.interface';
import { T_HandleTreatment } from './data-access/types/treatment-requests-service-form.type';
import { TREATMENT_MONITORING_STATE_ENUM } from '../../../presentation/pages/overseeing-operations/data-access/treatment-monitoring/enums/treatment-monitoring-state.enum';
import { TYPE_CUSTOMERS_ENUM } from '../../enum/type-customers.enum';

type customerSelectedType =
    | CustomersActivateInterface
    | WaitingQueueInterface
    | TreatmentMonitoringInterface;
@Component({
    selector: 'app-treatment-requests-service-form',
    templateUrl: './treatment-requests-service-form.component.html',
    styleUrls: ['./treatment-requests-service-form.component.scss'],
})
export class TreatmentRequestsServiceFormComponent
    implements OnInit, OnDestroy
{
    @Output() visibleForm: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() customerSelected: customerSelectedType;
    @Input() handleTreatment: T_HandleTreatment;
    @Input() fetchCustomers: () => void;

    public requestsServiceForm!: FormGroup<IAddTreatmentRequestsServiceFormValues>;
    public customerDetails: TreatmentRequestsServiceDetailsInterface;

    public listRegimesBusiness$: Observable<
        Array<{ code: string; nom: string }>
    >;
    public listLegalForm$: Observable<Array<{ code: string; nom: string }>>;

    private destroy$ = new Subject<void>();

    public isInvalidMemoized: Record<string, boolean> = {};
    private objectUrls: string[] = [];

    public selectedFile: File | null = null;
    public previewRows: string[][] = [];
    public headersValid = false;
    public importedRowsCount = 0;

    public fileName = '';
    public arrayHeaderExcelFile: string[] = [];
    public excelFileIsCorrect = false;
    public verifyingExcel = false;

    customerTypes = [
        { label: 'Entreprise commerciale', value: 'Commerciale' },
        { label: 'Entreprise publique', value: 'Association' },
        { label: 'Association', value: 'Publique' },
        { label: 'Personne physique', value: 'Personne physique' },
    ];

    constructor(
        private fb: FormBuilder,
        private toastService: ToastrService,
        private sharedService: SharedService,
        private translate: TranslateService,
        private requestsServiceFormApiService: TreatmentRequestsServiceFormApiService
    ) {}

    ngOnInit(): void {
        this.fetchRegimesBusiness();
        this.fetchLegalForms();
        this.loadCustomerDetails(this.customerSelected.numero_demande);
    }

    private loadCustomerDetails(numero_demande: string): void {
        this.requestsServiceFormApiService.fetchRequestsServiceDetails(
            numero_demande
        );

        this.requestsServiceFormApiService
            .getRequestsServiceDetails()
            .pipe(filter(Boolean), takeUntil(this.destroy$))
            .subscribe((details) => {
                this.customerDetails = details;
                this.initializeForm();
            });
    }

    private fetchRegimesBusiness(): void {
        this.sharedService.fetchRegimesBusiness();
        this.listRegimesBusiness$ = this.sharedService.getRegimesBusiness();
    }

    private fetchLegalForms(): void {
        this.sharedService.fetchLegalForms();
        this.listLegalForm$ = this.sharedService.getLegalForms();
    }

    private initializeForm(): void {
        const disabled = !this.disabledEditableForm;

        this.requestsServiceForm =
            this.fb.group<IAddTreatmentRequestsServiceFormValues>({
                type_entreprise: this.createControl(
                    this.customerDetails.tenant?.type_entreprise ?? '',
                    disabled,
                    [Validators.required]
                ),
                nom_client: this.createControl(
                    this.customerDetails.tenant?.nom_client ?? '',
                    disabled,
                    [Validators.required]
                ),
                adresse: this.createControl(
                    this.customerDetails.tenant?.adresse ?? '',
                    disabled,
                    [Validators.required]
                ),
                compte_client: this.createControl(
                    this.customerDetails.tenant?.compte_client ?? '',
                    disabled,
                    [Validators.required]
                ),
                email_admin_client: this.createControl(
                    this.customerDetails.tenant?.email_admin_client ?? '',
                    disabled,
                    [Validators.required, Validators.email]
                ),
                domaine_activite: this.createControl(
                    this.customerDetails.tenant?.domaine_activite ?? '',
                    disabled,
                    [Validators.required]
                ),
                logo_client: new FormControl<File | null>(null),

                nom_gerant: this.createControl(
                    this.customerDetails.tenant?.nom_gerant ?? '',
                    disabled,
                    [Validators.required]
                ),
                contact_gerant: this.createControl(
                    this.customerDetails.tenant?.contact_gerant ?? '',
                    disabled,
                    [Validators.required]
                ),
                email_gerant: this.createControl(
                    this.customerDetails.tenant?.email_gerant ?? '',
                    disabled,
                    [Validators.required, Validators.email]
                ),
                piece_gerant: new FormControl<File | null>(null),

                numero_rccm: this.createControl(
                    this.customerDetails.tenant?.numero_rccm ?? '',
                    disabled
                ),
                forme_juridique_code: this.createControl(
                    this.customerDetails.tenant?.forme_juridique_code ?? '',
                    disabled
                ),
                fichier_rccm: new FormControl<File | null>(null),

                numero_cc: this.createControl(
                    this.customerDetails.tenant?.numero_cc ?? '',
                    disabled
                ),
                regime_code: this.createControl(
                    this.customerDetails.tenant?.regime_code ?? '',
                    disabled
                ),
                centre: this.createControl(
                    this.customerDetails.tenant?.centre ?? '',
                    disabled
                ),
                fichier_dfe: new FormControl<File | null>(null),

                description: this.createControl(
                    this.customerDetails?.description ?? '',
                    disabled,
                    [Validators.required]
                ),
                commentaire_traitement: this.createControl(
                    this.customerDetails?.commentaire_traitement ?? '',
                    true
                ),
                commentaire_finalisation: this.createControl(
                    this.customerDetails?.commentaire_finalisation ?? '',
                    true
                ),
                commentaire_approbation: this.createControl(
                    this.customerDetails?.commentaire_approbation ?? '',
                    true
                ),

                accepte: this.createControl(
                    this.customerDetails?.accepte ?? '',
                    !this.displayClosureForm,
                    this.displayClosureForm ? [Validators.required] : []
                ),
                notation_cloture: this.createControl(
                    this.customerDetails?.notation_cloture ?? '',
                    !this.displayClosureForm,
                    this.displayClosureForm ? [Validators.required] : []
                ),
                commentaire: this.createControl(
                    this.customerDetails?.commentaire_cloture ?? '',
                    !this.displayClosureForm,
                    this.displayClosureForm ? [Validators.required] : []
                ),
            });

        this.requestsServiceForm
            .get('accepte')
            ?.valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe(this.handleAcceptChange.bind(this));
        this.requestsServiceForm
            .get('type_entreprise')
            ?.valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe(this.handleTypeEnterpriseChange.bind(this));
        this.requestsServiceForm.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => this.memoizeInvalids());

        this.memoizeInvalids();
    }

    private createControl<T>(
        value: T,
        disabled: boolean,
        validators: any[] = []
    ): FormControl<T> {
        return new FormControl(
            { value, disabled },
            { nonNullable: true, validators }
        );
    }

    private setControlValidators(
        ctrl: FormControl | null,
        validators: any[] = []
    ): void {
        if (!ctrl) return;
        ctrl.setValidators(validators);
        ctrl.updateValueAndValidity();
    }

    private handleTypeEnterpriseChange(type: string): void {
        const numeroRccm = this.requestsServiceForm.get('numero_rccm');
        const numeroCc = this.requestsServiceForm.get('numero_cc');
        // const pieceIdentite = this.requestsServiceForm.get('piece_identite');

        if (!numeroRccm || !numeroCc) return;

        if (type === 'Personne physique') {
            // this.setControlValidators(pieceIdentite as FormControl, [Validators.required]);
            this.setControlValidators(numeroRccm as FormControl);
            this.setControlValidators(numeroCc as FormControl);
        } else {
            this.setControlValidators(numeroRccm as FormControl, [
                Validators.required,
            ]);
            this.setControlValidators(numeroCc as FormControl, [
                Validators.required,
            ]);
            // this.setControlValidators(pieceIdentite as FormControl);
        }
    }

    private handleAcceptChange(value: 'oui' | 'non' | string): void {
        const commentaireCtrl = this.requestsServiceForm.get(
            'commentaire'
        ) as FormControl;
        const notationCtrl = this.requestsServiceForm.get(
            'notation_cloture'
        ) as FormControl;

        if (!commentaireCtrl || !notationCtrl) return;

        if (value === 'non') {
            this.setControlValidators(commentaireCtrl, [Validators.required]);
            notationCtrl.setValue('mécontent');
            notationCtrl.disable();
        } else if (value === 'oui') {
            this.setControlValidators(commentaireCtrl);
            if (notationCtrl.disabled) notationCtrl.enable();
        } else {
            this.setControlValidators(commentaireCtrl);
        }
    }

    private memoizeInvalids(): void {
        if (!this.requestsServiceForm) return;
        Object.keys(this.requestsServiceForm.controls).forEach((k) => {
            const ctrl = this.requestsServiceForm.get(k);
            this.isInvalidMemoized[k] = !!(
                ctrl &&
                ctrl.invalid &&
                (ctrl.dirty || ctrl.touched)
            );
        });
    }

    public isInvalid(path: string): boolean {
        return !!this.isInvalidMemoized[path];
    }

    public onChangeFile(
        list: FileList | null,
        control: keyof IAddTreatmentRequestsServiceFormValues
    ): void {
        if (!list || list.length === 0) {
            this.clearFileControl(control);
            return;
        }

        const file = list.item(0) as File;
        const allowedTypes = ['image/png', 'image/jpeg'];
        const maxSize = 5 * 1024 * 1024;

        if (!allowedTypes.includes(file.type) || file.size > maxSize) {
            this.requestsServiceForm.get(control as string)?.reset();
            this.toastService.error(
                this.translate.instant('INVALID_FILE_FORMAT')
            );
            return;
        }

        this.requestsServiceForm.patchValue({ [control]: file } as any);
        this.requestsServiceForm
            .get(control as string)
            ?.updateValueAndValidity();
    }

    private clearFileControl(
        control: keyof IAddTreatmentRequestsServiceFormValues,
        inputEl?: HTMLInputElement
    ) {
        this.requestsServiceForm.get(control as string)?.reset();
        if (inputEl) inputEl.value = '';
    }

    public viewFile(field: string): void {
        const fileOrUrl =
            this.requestsServiceForm.get(field as string)?.value ||
            (this.customerDetails?.tenant &&
                (this.customerDetails.tenant as any)[field]);

        if (!fileOrUrl) {
            this.toastService.info(this.translate.instant('NO_FILE_TO_VIEW'));
            return;
        }

        let url: string;
        if (fileOrUrl instanceof File) {
            url = URL.createObjectURL(fileOrUrl);
            this.objectUrls.push(url);
        } else {
            url = fileOrUrl;
        }

        const win = window.open(url, '_blank');
        if (fileOrUrl instanceof File && win) {
            win.addEventListener('beforeunload', () => {
                try {
                    URL.revokeObjectURL(url);
                } catch {}
            });
        }
    }

    public handleCloseModal(): void {
        this.visibleForm.emit(false);
    }

    private buildPayload(): FormData {
        const v = this.requestsServiceForm.getRawValue();
        return FormatFormData(v);
    }

    public async handleUpdateDemand(): Promise<void> {
        if (
            this.handleTreatment?.typeTreatment !==
            REQUESTS_SERVICE_TREATMENT_ENUM.MODIFY
        ) {
            this.toastService.warning(
                this.translate.instant('MODIFICATION_NOT_ALLOWED')
            );
            return;
        }

        if (!this.requestsServiceForm || this.requestsServiceForm.invalid) {
            this.toastService.error(this.translate.instant('FORM_INVALID'));
            return;
        }

        const payload = this.buildPayload();
        const CONFIRM_CLIENT_MODIFICATION = this.translate.instant(
            'CONFIRM_CLIENT_MODIFICATION'
        );

        const result = await Swal.mixin({
            customClass: SWALWITHBOOTSTRAPBUTTONSPARAMS.customClass,
        }).fire({
            ...SWALWITHBOOTSTRAPBUTTONSPARAMS.message,
            html: `<span><strong>${CONFIRM_CLIENT_MODIFICATION}</strong></span><span style="color: #5B9BD5; font-weight: bold; text-transform: uppercase"> ${
                this.requestsServiceForm.get('nom_client')?.value
            }</span>`,
            width: 800,
        });

        if (result.isConfirmed) {
            this.requestsServiceFormApiService.fetchModifyRequestsService(
                payload,
                this.customerSelected.numero_demande,
                this.toastService,
                () => this.fetchCustomers(),
                () => this.handleCloseModal()
            );
        }
    }

    public async onLetDownDemand(): Promise<void> {
        if (
            this.handleTreatment?.typeTreatment !==
            REQUESTS_SERVICE_TREATMENT_ENUM.MODIFY
        ) {
            this.toastService.warning(
                this.translate.instant('MODIFICATION_NOT_ALLOWED')
            );
            return;
        }

        const CONFIRM_CLIENT_ABANDON = this.translate.instant(
            'CONFIRM_CLIENT_ABANDON'
        );
        const YOU_ARE_ABOUT_TO_ABANDON_THE_TRANSACTION = this.translate.instant(
            'YOU_ARE_ABOUT_TO_ABANDON_THE_TRANSACTION'
        );
        const COMMENT = this.translate.instant('COMMENT');

        await Swal.mixin({
            customClass: SWALWITHBOOTSTRAPBUTTONSPARAMS.customClass,
        }).fire({
            title: `${YOU_ARE_ABOUT_TO_ABANDON_THE_TRANSACTION} [<span style="color: #5B9BD5">${this.customerSelected?.numero_demande}</span>]`,
            html: `<span><strong>${CONFIRM_CLIENT_ABANDON}</strong></span><span style="color: #5B9BD5; font-weight: bold; text-transform: uppercase"> ${
                this.requestsServiceForm.get('nom_client')?.value || ''
            }</span>`,
            input: 'text',
            inputPlaceholder: `Ex: ${COMMENT}...`,
            inputAttributes: { autocapitalize: 'off', autocomplete: 'off' },
            showCancelButton: true,
            cancelButtonText: this.translate.instant('CANCEL'),
            confirmButtonText: this.translate.instant('CONFIRM'),
            confirmButtonColor: '#569C5B',
            cancelButtonColor: '#dc3545',
            showLoaderOnConfirm: true,
            backdrop: false,
            width: 800,
            didOpen: () => {
                const input = Swal.getInput();
                const confirmButton = Swal.getConfirmButton();
                if (input && confirmButton) {
                    confirmButton.disabled = true;
                    input.addEventListener('input', () => {
                        confirmButton.disabled = !input.value.trim();
                    });
                }
            },
            preConfirm: async (comment: string) => {
                const payload = { commentaire: comment || '' };
                try {
                    await this.requestsServiceFormApiService.fetchAbandonRequestsService(
                        payload,
                        this.customerSelected.numero_demande,
                        this.toastService,
                        () => this.fetchCustomers?.(),
                        () => this.handleCloseModal()
                    );
                } catch (error) {
                    Swal.showValidationMessage(`${error}`);
                }
            },
            allowOutsideClick: () => !Swal.isLoading(),
        });
    }

    public async handleClosureDemand(): Promise<void> {
        if (
            this.handleTreatment?.typeTreatment !==
            REQUESTS_SERVICE_TREATMENT_ENUM.CLOSURE
        ) {
            this.toastService.warning(
                this.translate.instant('CLOSURE_NOT_ALLOWED')
            );
            return;
        }

        if (!this.requestsServiceForm || this.requestsServiceForm.invalid) {
            this.toastService.error(this.translate.instant('FORM_INVALID'));
            return;
        }

        const payload = this.requestsServiceForm.getRawValue();
        const CONFIRM_CLOSURE_DEMAND = this.translate.instant(
            'CONFIRM_CLOSURE_DEMAND'
        );

        const result = await Swal.mixin({
            customClass: SWALWITHBOOTSTRAPBUTTONSPARAMS.customClass,
        }).fire({
            ...SWALWITHBOOTSTRAPBUTTONSPARAMS.message,
            html: `<span><strong>${CONFIRM_CLOSURE_DEMAND}</strong></span><span style="color: #5B9BD5; font-weight: bold; text-transform: uppercase"> ${this.customerSelected?.numero_demande}</span>`,
            width: 800,
        });

        if (result.isConfirmed) {
            this.requestsServiceFormApiService.fetchClosureRequestsService(
                payload,
                this.customerSelected.numero_demande,
                this.toastService,
                () => this.fetchCustomers(),
                () => this.handleCloseModal()
            );
        }
    }

    public get displayClosureForm(): boolean {
        return (
            this.customerDetails.traitement ===
                TREATMENT_MONITORING_STATE_ENUM.DO &&
            this.handleTreatment?.typeTreatment ===
                REQUESTS_SERVICE_TREATMENT_ENUM.CLOSURE
        );
    }
    public get disabledEditableForm(): boolean {
        return (
            this.customerDetails.traitement ===
                TREATMENT_MONITORING_STATE_ENUM.IN_WAITING &&
            this.handleTreatment?.typeTreatment ===
                REQUESTS_SERVICE_TREATMENT_ENUM.MODIFY
        );
    }
    public get displayFinalizedBlock(): boolean {
        return !!this.customerDetails?.finalise_par;
    }
    public get displayApprovedBlock(): boolean {
        return !!this.customerDetails?.accepte_approbation;
    }
    public get displayClosedBlock(): boolean {
        return !!this.customerDetails?.cloture_a;
    }

    public get rapportCodeStyle(): string {
        return getRapportCodeStyle(this.customerDetails);
    }

    public get dateSoumission(): string {
        const details = this.customerSelected;
        if (!details) return '-- : --';

        switch (true) {
            case details.traitement ===
                CUSTOMERS_ACTIVATE_STATE_ENUM.IN_WAITING:
                return details.created_at;
            case details.etat_soumission ===
                CUSTOMERS_ACTIVATE_STATE_ENUM.RECEIVE ||
                details.etat_soumission ===
                    CUSTOMERS_ACTIVATE_STATE_ENUM.IN_PROGRESS:
                return details.acquitte_a ?? '-- : --';
            case details.traitement === CUSTOMERS_ACTIVATE_STATE_ENUM.APPROVE ||
                details.traitement === CUSTOMERS_ACTIVATE_STATE_ENUM.REJECT:
                return details.approuve_a ?? '-- : --';
            default:
                return details.created_at;
        }
    }

    ngOnDestroy(): void {
        this.objectUrls.forEach((u) => {
            try {
                URL.revokeObjectURL(u);
            } catch {}
        });
        this.objectUrls = [];

        this.destroy$.next();
        this.destroy$.complete();
    }
}
