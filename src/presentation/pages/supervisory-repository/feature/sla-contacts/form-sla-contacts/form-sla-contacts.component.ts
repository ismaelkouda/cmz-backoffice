import { CommonModule } from '@angular/common';
import {
    Component,
    Input,
    OnChanges,
    OnDestroy,
    SimpleChanges,
} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { filter, Observable, Subject, takeUntil } from 'rxjs';
import { FormatFormData } from '../../../../../../shared/functions/formatFormData.function';
import { ApplicantInterface } from '../../../../../../shared/interfaces/applicant';
import { SharedService } from '../../../../../../shared/services/shared.service';
import { SlaContactsFormInterface } from '../../../data-access/sla-contacts/interfaces/sla-contacts-form.interface';
import { SlaContactsInterface } from '../../../data-access/sla-contacts/interfaces/sla-contacts.interface';
import { SlaContactsApiService } from '../../../data-access/sla-contacts/services/sla-contacts-api.service';
import {
    SLA_CONTACTS_FORM_MODE_ENUM,
    T_SLA_CONTACTS_FORM_MODE_ENUM,
} from './../../../data-access/sla-contacts/enums/sla-contacts-form-mode.enum';
const Swal = require('sweetalert2');

@Component({
    selector: 'app-form-sla-contacts',
    standalone: true,
    templateUrl: './form-sla-contacts.component.html',
    styleUrls: ['./form-sla-contacts.component.scss'],
    imports: [CommonModule, TranslateService],
})
export class FormSlaContactsComponent implements OnChanges, OnDestroy {
    @Input() slaContacts!: SlaContactsInterface;
    @Input() formMode!: T_SLA_CONTACTS_FORM_MODE_ENUM;
    public SLA_CONTACTS_FORM_MODE_ENUM = SLA_CONTACTS_FORM_MODE_ENUM;
    public slaContactsForm!: FormGroup<SlaContactsFormInterface>;

    public listRegimesBusiness$!: Observable<
        Array<{ code: string; nom: string }>
    >;
    public listLegalForm$!: Observable<Array<{ code: string; nom: string }>>;
    public listApplicants$!: Observable<Array<ApplicantInterface>>;

    private destroy$ = new Subject<void>();

    constructor(
        private fb: FormBuilder,
        private toastService: ToastrService,
        private sharedService: SharedService,
        private translate: TranslateService,
        private slaContactsApiService: SlaContactsApiService
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (
            (changes['formMode'] && !changes['formMode'].firstChange) ||
            this.formMode
        ) {
            if (
                changes['formMode']?.currentValue ===
                    SLA_CONTACTS_FORM_MODE_ENUM.SEE ||
                this.formMode === SLA_CONTACTS_FORM_MODE_ENUM.SEE
            ) {
                this.fetchRegimesBusiness();
                this.fetchLegalForms();
                this.fetchApplicants();
            }
            this.initializeForm();
        }
    }

    private fetchApplicants(): void {
        this.sharedService.fetchApplicants();
        this.listApplicants$ = this.sharedService.getApplicants();
    }

    private fetchRegimesBusiness(): void {
        this.sharedService.fetchRegimesBusiness();
        this.listRegimesBusiness$ = this.sharedService.getRegimesBusiness();
    }

    private fetchLegalForms(): void {
        this.sharedService.fetchLegalForms();
        this.listLegalForm$ = this.sharedService.getLegalForms();
    }

    public get disabledEditableForm(): boolean {
        return this.formMode === SLA_CONTACTS_FORM_MODE_ENUM.SEE;
    }

    private initializeForm(): void {
        const disabled = !this.disabledEditableForm;
        this.slaContactsForm = this.fb.group<SlaContactsFormInterface>({
            nom_tenant: new FormControl(
                {
                    value: this.slaContacts.nom_tenant ?? '',
                    disabled,
                },
                {
                    nonNullable: true,
                    validators: [Validators.required],
                }
            ),
            adresse: new FormControl(
                {
                    value: this.slaContacts.adresse ?? '',
                    disabled,
                },
                {
                    nonNullable: true,
                    validators: [Validators.required],
                }
            ),
            email_diffusion_tenant: new FormControl(
                {
                    value: this.slaContacts.email_diffusion_tenant ?? '',
                    disabled,
                },
                {
                    nonNullable: true,
                    validators: [Validators.required, Validators.email],
                }
            ),

            gestionnaire_tenant_id: new FormControl(
                {
                    value: disabled
                        ? this.slaContacts.nom_gestionnaire_tenant
                        : this.slaContacts.gestionnaire_tenant_id,
                    disabled,
                },
                {
                    nonNullable: true,
                    validators: [Validators.required],
                }
            ),
            contact_gestionnaire_tenant: new FormControl(
                {
                    value: this.slaContacts.contact_gestionnaire_tenant ?? '',
                    disabled,
                },
                {
                    nonNullable: true,
                    validators: [Validators.required],
                }
            ),
            email_gestionnaire_tenant: new FormControl(
                {
                    value: this.slaContacts.email_gestionnaire_tenant ?? '',
                    disabled,
                },
                {
                    nonNullable: true,
                    validators: [Validators.required, Validators.email],
                }
            ),
            admin_tenant_id: new FormControl(
                {
                    value: disabled
                        ? this.slaContacts.nom_admin_tenant
                        : this.slaContacts.admin_tenant_id,
                    disabled,
                },
                {
                    nonNullable: true,
                    validators: [Validators.required],
                }
            ),
            contact_admin_tenant: new FormControl(
                {
                    value: this.slaContacts.contact_admin_tenant ?? '',
                    disabled,
                },
                {
                    nonNullable: true,
                    validators: [Validators.required],
                }
            ),
            email_admin_tenant: new FormControl(
                {
                    value: this.slaContacts.email_admin_tenant ?? '',
                    disabled,
                },
                {
                    nonNullable: true,
                    validators: [Validators.required, Validators.email],
                }
            ),

            escalade_tenant_id: new FormControl(
                {
                    value: disabled
                        ? this.slaContacts.nom_escalade_tenant
                        : this.slaContacts.escalade_tenant_id,
                    disabled,
                },
                {
                    nonNullable: true,
                    validators: [Validators.required],
                }
            ),
            contact_escalade_tenant: new FormControl(
                {
                    value: this.slaContacts.contact_escalade_tenant ?? '',
                    disabled,
                },
                {
                    nonNullable: true,
                    validators: [Validators.required],
                }
            ),
            email_escalade_tenant: new FormControl(
                {
                    value: this.slaContacts.email_escalade_tenant ?? '',
                    disabled,
                },
                {
                    nonNullable: true,
                    validators: [Validators.required, Validators.email],
                }
            ),
            nom_gerant: new FormControl(
                {
                    value: this.slaContacts.nom_gerant ?? '',
                    disabled,
                },
                {
                    nonNullable: true,
                    validators: [Validators.required],
                }
            ),
            contact_gerant: new FormControl(
                {
                    value: this.slaContacts.contact_gerant ?? '',
                    disabled,
                },
                {
                    nonNullable: true,
                    validators: [Validators.required],
                }
            ),
            email_gerant: new FormControl(
                {
                    value: this.slaContacts.email_gerant ?? '',
                    disabled,
                },
                {
                    nonNullable: true,
                    validators: [Validators.required, Validators.email],
                }
            ),
            piece_gerant: new FormControl<File | null>(null, {
                nonNullable: true,
                validators: [Validators.required],
            }),

            numero_rccm: new FormControl({
                value: this.slaContacts.numero_rccm ?? '',
                disabled,
            }),
            forme_juridique_code: new FormControl<string | null>({
                value: disabled
                    ? this.slaContacts.forme_juridique
                    : this.slaContacts.forme_juridique_code,
                disabled,
            }),
            fichier_rccm: new FormControl<File | null>(null, {
                nonNullable: true,
                validators: [Validators.required],
            }),

            numero_cc: new FormControl({
                value: this.slaContacts.numero_cc ?? '',
                disabled,
            }),
            regime_code: new FormControl<string | null>({
                value: disabled
                    ? this.slaContacts.regime
                    : this.slaContacts.regime_code,
                disabled,
            }),
            centre: new FormControl({
                value: this.slaContacts.centre ?? '',
                disabled,
            }),
            fichier_dfe: new FormControl<File | null>(null, {
                nonNullable: true,
                validators: [Validators.required],
            }),

            description: new FormControl(
                {
                    value: this.slaContacts.description ?? '',
                    disabled,
                },
                {
                    nonNullable: true,
                    validators: [Validators.required],
                }
            ),
        });

        this.setupApplicantBinding(
            'admin_tenant_id',
            'contact_admin_tenant',
            'email_admin_tenant'
        );
        this.setupApplicantBinding(
            'escalade_tenant_id',
            'contact_escalade_tenant',
            'email_escalade_tenant'
        );
        this.setupApplicantBinding(
            'gestionnaire_tenant_id',
            'contact_gestionnaire_tenant',
            'email_gestionnaire_tenant'
        );
        if (!this.disabledEditableForm) {
            this.slaContactsForm.disable();
        }
    }

    private setupApplicantBinding(
        idControlName: keyof SlaContactsFormInterface,
        contactControlName: keyof SlaContactsFormInterface,
        emailControlName: keyof SlaContactsFormInterface
    ): void {
        const idControl = this.slaContactsForm.get(idControlName);
        const contactControl = this.slaContactsForm.get(contactControlName);
        const emailControl = this.slaContactsForm.get(emailControlName);

        if (!idControl) return;

        idControl.valueChanges
            .pipe(
                takeUntil(this.destroy$),
                filter((val): val is string => !!val)
            )
            .subscribe((value) => {
                this.listApplicants$
                    ?.pipe(takeUntil(this.destroy$))
                    .subscribe((applicants) => {
                        const userSelected = applicants.find(
                            (u) => u.id === value
                        );
                        if (userSelected) {
                            contactControl?.setValue(userSelected.contacts);
                            emailControl?.setValue(userSelected.email);
                        } else {
                            contactControl?.reset();
                            emailControl?.reset();
                        }
                    });
            });
    }

    public onChangeFile(
        list: FileList | null,
        control: keyof SlaContactsFormInterface
    ): void {
        if (!list || list.length === 0) {
            this.clearExcelFile(control);
            return;
        }
        const file = list.item(0) as File;
        this.slaContactsForm.patchValue({ [control]: file } as any);
        this.slaContactsForm.get(control)?.updateValueAndValidity();
        if (
            control === 'piece_gerant' ||
            control === 'fichier_rccm' ||
            control === 'fichier_dfe'
        ) {
            const valid = /(png|jpg|jpeg)$/i.test(file.name);
            if (!valid) {
                this.slaContactsForm.get(control)?.reset();
                this.toastService.error(
                    this.translate.instant('INVALID_FILE_FORMAT')
                );
                return;
            }
        }
    }

    private clearExcelFile(
        control: keyof SlaContactsFormInterface,
        excelInput?: HTMLInputElement
    ): void {
        this.slaContactsForm.get(control)?.reset();
        if (excelInput) excelInput.value = '';
    }

    public viewFile(field: keyof SlaContactsFormInterface) {
        const file = this.slaContactsForm.get(field)?.value as File | null;
        const defaultFile: string =
            (this.slaContacts?.[
                field as keyof SlaContactsInterface
            ] as unknown as string) ?? '';
        if (!file && !defaultFile) {
            this.toastService.info('Aucun fichier à afficher');
            return;
        }
        if (file) window.open(URL.createObjectURL(file as File), '_blank');
        if (defaultFile) window.open(defaultFile, '_blank');
    }

    isInvalid(path: keyof SlaContactsFormInterface): boolean {
        const ctrl = this.slaContactsForm.get(path as string);
        return !!ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched);
    }

    private buildPayload(): FormData {
        const v = this.slaContactsForm.getRawValue();
        const fd = FormatFormData(v);
        return fd;
    }

    async handleSave(): Promise<void> {
        if (this.slaContactsForm.invalid) {
            this.slaContactsForm.markAllAsTouched();
            this.toastService.error(this.translate.instant('FORM_INVALID'));
            return;
        }

        const result = await Swal.fire({
            title: this.translate.instant('CONFIRM_CLIENT_MODIFICATION'),
            text: this.slaContactsForm.get('nom_tenant')?.value,
            icon: 'question',
            showCancelButton: true,
        });

        if (result.isConfirmed) {
            const payload: FormData = this.buildPayload();
            this.slaContactsApiService.fetchUpdateSlaContacts(
                payload,
                this.toastService,
                () => {
                    this.formMode = SLA_CONTACTS_FORM_MODE_ENUM.SEE;
                    this.slaContactsApiService.setSlaContactsFormMode(
                        this.formMode
                    );
                }
            );
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
