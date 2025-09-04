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
import { Observable, Subject, takeUntil } from 'rxjs';
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
        console.log('customerSelected', this.customerSelected);

        this.fetchRegimesBusiness();
        this.fetchLegalForms();
        this.requestsServiceFormApiService.fetchRequestsServiceDetails(
            this.customerSelected?.numero_demande
        );
        this.requestsServiceFormApiService
            .getRequestsServiceDetails()
            .subscribe((value) => {
                this.customerDetails = value;
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
                type_entreprise: new FormControl(
                    {
                        value:
                            this.customerDetails.tenant?.type_entreprise ?? '',
                        disabled,
                    },
                    { nonNullable: true, validators: [Validators.required] }
                ),
                nom_client: new FormControl(
                    {
                        value: this.customerDetails.tenant?.nom_client ?? '',
                        disabled,
                    },
                    { nonNullable: true, validators: [Validators.required] }
                ),
                adresse: new FormControl(
                    {
                        value: this.customerDetails.tenant?.adresse ?? '',
                        disabled,
                    },
                    { nonNullable: true, validators: [Validators.required] }
                ),
                compte_client: new FormControl(
                    {
                        value: this.customerDetails.tenant?.compte_client ?? '',
                        disabled,
                    },
                    { nonNullable: true, validators: [Validators.required] }
                ),
                email_admin_client: new FormControl(
                    {
                        value:
                            this.customerDetails.tenant?.email_admin_client ??
                            '',
                        disabled,
                    },
                    {
                        nonNullable: true,
                        validators: [Validators.required, Validators.email],
                    }
                ),
                domaine_activite: new FormControl(
                    {
                        value:
                            this.customerDetails.tenant?.domaine_activite ?? '',
                        disabled,
                    },
                    { nonNullable: true, validators: [Validators.required] }
                ),
                logo_client: new FormControl<File | null>(null),

                nom_gerant: new FormControl(
                    {
                        value: this.customerDetails.tenant?.nom_gerant ?? '',
                        disabled,
                    },
                    { nonNullable: true, validators: [Validators.required] }
                ),
                contact_gerant: new FormControl(
                    {
                        value:
                            this.customerDetails.tenant?.contact_gerant ?? '',
                        disabled,
                    },
                    { nonNullable: true, validators: [Validators.required] }
                ),
                email_gerant: new FormControl(
                    {
                        value: this.customerDetails.tenant?.email_gerant ?? '',
                        disabled,
                    },
                    {
                        nonNullable: true,
                        validators: [Validators.required, Validators.email],
                    }
                ),
                piece_gerant: new FormControl<File | null>(null),

                numero_rccm: new FormControl(
                    {
                        value: this.customerDetails.tenant?.numero_rccm ?? '',
                        disabled,
                    },
                    { nonNullable: true, validators: [Validators.required] }
                ),
                forme_juridique_code: new FormControl(
                    {
                        value:
                            this.customerDetails.tenant?.forme_juridique_code ??
                            '',
                        disabled,
                    },
                    { nonNullable: true, validators: [Validators.required] }
                ),
                fichier_rccm: new FormControl<File | null>(null),

                numero_cc: new FormControl(
                    {
                        value: this.customerDetails.tenant?.numero_cc ?? '',
                        disabled,
                    },
                    { nonNullable: true, validators: [Validators.required] }
                ),
                regime_code: new FormControl(
                    {
                        value: this.customerDetails.tenant?.regime_code,
                        disabled,
                    },
                    { nonNullable: true, validators: [Validators.required] }
                ),
                centre: new FormControl(
                    {
                        value: this.customerDetails.tenant?.centre ?? '',
                        disabled,
                    },
                    { nonNullable: true, validators: [Validators.required] }
                ),
                fichier_dfe: new FormControl<File | null>(null),

                description: new FormControl(
                    {
                        value: this.customerDetails?.description ?? '',
                        disabled,
                    },
                    { nonNullable: true, validators: [Validators.required] }
                ),
                commentaire_traitement: new FormControl(
                    {
                        value:
                            this.customerDetails?.commentaire_traitement ?? '',
                        disabled: true,
                    },
                    { nonNullable: true }
                ),
                commentaire_finalisation: new FormControl(
                    {
                        value:
                            this.customerDetails?.commentaire_finalisation ??
                            '',
                        disabled: true,
                    },
                    { nonNullable: true }
                ),
                commentaire_approbation: new FormControl(
                    {
                        value:
                            this.customerDetails?.commentaire_approbation ?? '',
                        disabled: true,
                    },
                    { nonNullable: true }
                ),

                accepte: new FormControl(
                    {
                        value: this.customerDetails?.accepte ?? '',
                        disabled: !this.displayClosureForm,
                    },
                    {
                        nonNullable: true,
                        validators: this.displayClosureForm
                            ? [Validators.required]
                            : [],
                    }
                ),
                notation_cloture: new FormControl(
                    {
                        value: this.customerDetails?.notation_cloture ?? '',
                        disabled: !this.displayClosureForm,
                    },
                    {
                        nonNullable: true,
                        validators: this.displayClosureForm
                            ? [Validators.required]
                            : [],
                    }
                ),
                commentaire: new FormControl(
                    {
                        value: this.customerDetails?.commentaire_cloture ?? '',
                        disabled: !this.displayClosureForm,
                    },
                    {
                        nonNullable: true,
                        validators: this.displayClosureForm
                            ? [Validators.required]
                            : [],
                    }
                ),
            });

        this.requestsServiceForm
            .get('accepte')
            ?.valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((v) => this.handleAcceptChange(v));

        // if (!this.disabledEditableForm) {
        //     this.requestsServiceForm.disable();
        // }

        this.requestsServiceForm
            .get('type_entreprise')
            ?.valueChanges.subscribe((type) => {
                if (type === 'Personne physique') {
                    this.requestsServiceForm
                        .get('piece_identite')
                        ?.setValidators([Validators.required]);
                    this.requestsServiceForm
                        .get('numero_rccm')
                        ?.clearValidators();
                    this.requestsServiceForm
                        .get('numero_cc')
                        ?.clearValidators();
                } else {
                    this.requestsServiceForm
                        .get('numero_rccm')
                        ?.setValidators([Validators.required]);
                    this.requestsServiceForm
                        .get('numero_cc')
                        ?.setValidators([Validators.required]);
                    this.requestsServiceForm
                        .get('piece_identite')
                        ?.clearValidators();
                }
                this.requestsServiceForm.updateValueAndValidity();
            });
    }

    isClientType(type: string): boolean {
        return this.requestsServiceForm.get('type_entreprise')?.value === type;
    }

    private getAcceptInitialValue(): string {
        if (!this.customerDetails) return '';
        if (this.customerDetails.traitement === 'DONE') return 'oui';
        if (this.customerDetails.traitement === 'REJECT') return 'non';
        return '';
    }

    private handleAcceptChange(value: 'oui' | 'non' | string) {
        if (value === 'non') {
            this.requestsServiceForm
                .get('commentaire')
                ?.setValidators([Validators.required]);
            this.requestsServiceForm
                .get('notation_cloture')
                ?.setValue('mécontent');
            this.requestsServiceForm.get('notation_cloture')?.disable();
        } else if (value === 'oui') {
            this.requestsServiceForm.get('commentaire')?.clearValidators();
            this.requestsServiceForm.get('notation_cloture')?.enable();
        } else {
            this.requestsServiceForm.get('commentaire')?.clearValidators();
        }
        this.requestsServiceForm.get('commentaire')?.updateValueAndValidity();
        this.requestsServiceForm
            .get('notation_cloture')
            ?.updateValueAndValidity();
    }

    onChangeFile(
        list: FileList | null,
        control: keyof IAddTreatmentRequestsServiceFormValues
    ): void {
        if (!list || list.length === 0) {
            this.clearExcelFile(control);
            return;
        }
        const file = list.item(0) as File;
        this.requestsServiceForm.patchValue({ [control]: file } as any);
        this.requestsServiceForm.get(control)?.updateValueAndValidity();
        if (
            control === 'piece_gerant' ||
            control === 'fichier_rccm' ||
            control === 'fichier_dfe' ||
            control === 'logo_client'
        ) {
            const valid = /(png|jpg|jpeg)$/i.test(file.name);
            if (!valid) {
                this.requestsServiceForm.get(control)?.reset();
                this.toastService.error(
                    this.translate.instant('INVALID_FILE_FORMAT')
                );
                return;
            }
        }
    }

    private clearExcelFile(
        control: keyof IAddTreatmentRequestsServiceFormValues,
        excelInput?: HTMLInputElement
    ): void {
        this.requestsServiceForm.get(control)?.reset();
        if (excelInput) excelInput.value = '';
    }

    public viewFile(field: string) {
        const file = this.requestsServiceForm.get(field)?.value as File | null;
        const defaultFile = this.customerDetails.tenant?.[field];
        if (!file && !defaultFile) {
            this.toastService.info('Aucun fichier à afficher');
            return;
        }
        if (file) window.open(URL.createObjectURL(file as File), '_blank');
        if (defaultFile) window.open(defaultFile, '_blank');
    }

    public handleCloseModal(): void {
        this.visibleForm.emit(false);
    }

    isInvalid(path): boolean {
        const ctrl = this.requestsServiceForm.get(path as string);
        return !!ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched);
    }

    private buildPayload(): FormData {
        const v = this.requestsServiceForm.getRawValue();
        const fd = FormatFormData(v);
        return fd;
    }

    public async handleUpdateDemand(): Promise<void> {
        if (
            this.handleTreatment?.typeTreatment !==
            REQUESTS_SERVICE_TREATMENT_ENUM.MODIFY
        ) {
            this.toastService.warning('Modification non autorisée');
            return;
        }
        if (this.requestsServiceForm.invalid) {
            this.toastService.error('Formulaire invalide');
            return;
        }
        const payload: FormData = this.buildPayload();

        const CONFIRM_CLIENT_MODIFICATION = this.translate.instant(
            'CONFIRM_CLIENT_MODIFICATION'
        );
        const NUMBER_OF_IMPORTED_SIM = this.translate.instant(
            'NUMBER_OF_IMPORTED_SIM'
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
                () => {
                    this.fetchCustomers();
                },
                () => {
                    this.handleCloseModal();
                }
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

    public async onLetDownDemand(): Promise<void> {
        if (
            this.handleTreatment?.typeTreatment !==
            REQUESTS_SERVICE_TREATMENT_ENUM.MODIFY
        ) {
            this.toastService.warning('Modification non autorisée');
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
                this.requestsServiceForm.get('nom_client')?.value
            }</span>`,
            input: 'text',
            inputPlaceholder: `Ex: ${COMMENT}...`,
            inputAttributes: { autocapitalize: 'off', autocomplete: 'off' },
            showCancelButton: true,
            cancelButtonText: 'Annuler        ',
            confirmButtonText: 'Confirmer',
            confirmButtonColor: '#569C5B',
            cancelButtonColor: '#dc3545',
            showLoaderOnConfirm: true,
            backdrop: false,
            width: 800,
            didOpen: () => {
                const input = Swal.getInput();
                const confirmButton = Swal.getConfirmButton();
                confirmButton.disabled = true;
                input?.addEventListener('input', () => {
                    confirmButton.disabled = !input.value.trim();
                });
            },
            preConfirm: async (comment: string) => {
                const payload = { commentaire: comment };
                try {
                    this.requestsServiceFormApiService.fetchAbandonRequestsService(
                        payload,
                        this.customerSelected.numero_demande,
                        this.toastService,
                        () => {
                            this.fetchCustomers();
                        },
                        () => {
                            this.handleCloseModal();
                        }
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
            this.toastService.warning('Clôture non autorisée');
            return;
        }
        if (this.requestsServiceForm.invalid) {
            this.toastService.error('Formulaire invalide');
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
                () => {
                    this.fetchCustomers();
                },
                () => {
                    this.handleCloseModal();
                }
            );
        }
    }

    public get OnGetRapportCodeStyle(): string {
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
        this.destroy$.next();
        this.destroy$.complete();
    }
}
