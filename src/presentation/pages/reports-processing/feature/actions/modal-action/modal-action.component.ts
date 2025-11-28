import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
    computed,
    effect,
    inject,
    input,
    output,
    signal
} from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    ValidationErrors,
    Validators,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActionsFormControlEntity } from '@presentation/pages/reports-processing/domain/entities/actions/actions-form-control.entity';
import { ActionsPayloadEntity } from '@presentation/pages/reports-processing/domain/entities/actions/actions-payload.entity';
import { ActionsEntity } from '@presentation/pages/reports-processing/domain/entities/actions/actions.entity';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { Subject, takeUntil } from 'rxjs';

export type ActionModalMode = 'create' | 'edit';

@Component({
    selector: 'app-modal-action',
    standalone: true,
    templateUrl: './modal-action.component.html',
    styleUrls: ['./modal-action.component.scss'],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TranslateModule,
        DialogModule,
        SelectModule,
        ButtonModule,
        InputGroupModule,
        InputTextModule,
        InputGroupAddonModule,
        TextareaModule,
        DatePickerModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalActionComponent implements OnInit, OnDestroy {
    public readonly visible = input<boolean>(false);
    public readonly reportUniqId = input.required<string>();
    public readonly action = input<ActionsEntity | null>(null);
    public readonly mode = input<ActionModalMode>('create');

    public readonly visibleChange = output<boolean>();
    public readonly actionCreate = output<ActionsPayloadEntity>();
    public readonly actionUpdate = output<{
        id: string;
        data: ActionsPayloadEntity;
    }>();
    public readonly closed = output<void>();

    private readonly fb = inject(FormBuilder);
    private readonly translate = inject(TranslateService);
    private readonly destroy$ = new Subject<void>();

    public readonly modalTitle = computed(() => {
        const key = this.mode() === 'create' ? 'CREATE' : 'EDIT';
        return this.translate.instant(`ACTIONS.MODAL.TITLE.${key}`);
    });

    public readonly submitButtonLabel = computed(() => {
        const key = this.mode() === 'create' ? 'CREATE' : 'UPDATE';
        return this.translate.instant(`ACTIONS.BUTTONS.${key}`);
    });

    public readonly actionTypes = computed(() => [
        {
            value: 'ANALYSIS',
            label: this.translate.instant('ACTIONS.TYPES.ANALYSIS'),
        },
        {
            value: 'TREATMENT',
            label: this.translate.instant('ACTIONS.TYPES.TREATMENT'),
        },
        {
            value: 'VERIFICATION',
            label: this.translate.instant('ACTIONS.TYPES.VERIFICATION'),
        },
        {
            value: 'CORRECTION',
            label: this.translate.instant('ACTIONS.TYPES.CORRECTION'),
        },
        {
            value: 'VALIDATION',
            label: this.translate.instant('ACTIONS.TYPES.VALIDATION'),
        },
        {
            value: 'OTHER',
            label: this.translate.instant('ACTIONS.TYPES.OTHER'),
        },
    ]);

    public readonly today = new Date().toISOString().split('T')[0];

    public actionForm!: FormGroup<ActionsFormControlEntity>;
    private readonly _isSubmitted = signal<boolean>(false);
    public readonly isSubmitted = this._isSubmitted.asReadonly();

    public readonly maxDescriptionLength = 1000;

    constructor() {
    }

    ngOnInit(): void {
        this.actionForm = this.buildForm();
        this.setupFormListeners();
        this.initializeForm();
    }

    private initializeForm(): void {
        if (this.mode() === 'edit' && this.action()) {
            this.patchFormWithActionData();
        } else {
            this.initializeFormForCreation();
        }
    }

    private patchFormWithActionData(): void {
        const action = this.action();

        if (action) {
            const formattedDate = this.formatDateForPicker(action.date);

            this.actionForm.patchValue({
                report_uniq_id: this.reportUniqId(),
                date: formattedDate,
                type: action.type || '',
                description: action.description,
            });

            this.actionForm.updateValueAndValidity();
        }
    }
    private formatDateForPicker(dateString: string): string {
        if (!dateString) return '';

        try {
            const date = new Date(dateString);
            return date.toISOString().split('T')[0];
        } catch {
            return dateString;
        }
    }
    private initializeFormForCreation(): void {
        this.actionForm.patchValue({
            report_uniq_id: this.reportUniqId(),
            date: this.today,
        });
    }

    public onModalVisibilityChange(visible: boolean): void {
        if (!visible) {
            this.closeModal();
        }
    }

    private buildForm(): FormGroup<ActionsFormControlEntity> {
        return this.fb.group<ActionsFormControlEntity>({
            report_uniq_id: new FormControl<string>('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            date: new FormControl<string>(
                {
                    value: '',
                    disabled: this.mode() === 'edit',
                },
                {
                    nonNullable: true,
                    validators: [
                        Validators.required,
                        this.dateValidator.bind(this),
                    ],
                }
            ),
            type: new FormControl<string>('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            description: new FormControl<string>('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
        });
    }

    private setupModeWatcher(): void {
        effect(() => {
            const mode = this.mode();
            const dateControl = this.actionForm.get('date');

            if (mode === 'edit') {
                dateControl?.disable();
            } else {
                dateControl?.enable();
            }
        });
    }

    private dateValidator(control: AbstractControl): ValidationErrors | null {
        const value = control.value;

        if (!value) return null;

        try {
            const inputDate = new Date(value);
            const today = new Date();
            today.setHours(23, 59, 59, 999);

            if (isNaN(inputDate.getTime())) {
                return { invalidDate: true };
            }

            if (inputDate > today) {
                return { futureDate: true };
            }

            return null;
        } catch {
            return { invalidDate: true };
        }
    }

    private setupFormListeners(): void {
        this.actionForm.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                if (this.isSubmitted()) {
                    this._isSubmitted.set(false);
                }
            });
    }

    public onHide(): void {
        this.closeModal();
    }

    public onSubmit(): void {
        this._isSubmitted.set(true);

        if (this.actionForm.valid) {
            const formData = this.prepareFormData();
            alert(JSON.stringify(formData));
            if (this.mode() === 'edit' && this.action()?.id) {
                console.log('edit');
                this.actionUpdate.emit({
                    id: this.action()!.id!,
                    data: formData,
                });
            } else {
                console.log('create');
                this.actionCreate.emit(formData);
            }
        } else {
            this.markAllFieldsAsTouched();
        }
    }

    private prepareFormData(): ActionsPayloadEntity {
        const formValue = this.actionForm.getRawValue();

        return {
            report_uniq_id: this.reportUniqId(),
            date: this.formatDate(formValue.date),
            type: formValue.type,
            description: formValue.description.trim(),
        };
    }

    private formatDate(dateValue: any): string {
        if (dateValue instanceof Date) {
            return dateValue.toISOString().split('T')[0];
        }

        if (typeof dateValue === 'string') {
            return dateValue;
        }

        return dateValue;
    }

    private markAllFieldsAsTouched(): void {
        Object.keys(this.actionForm.controls).forEach((key) => {
            this.actionForm.get(key)?.markAsTouched();
        });
    }

    private closeModal(): void {
        this.visibleChange.emit(false);
        this.closed.emit();
        this.resetForm();
    }

    private resetForm(): void {
        this.actionForm.reset();
        this._isSubmitted.set(false);
    }

    public getFieldError(fieldName: string): string {
        const control = this.actionForm.get(fieldName);

        if (!control?.errors || (!control.touched && !this.isSubmitted())) {
            return '';
        }

        const errors = control.errors;

        if (errors['required']) {
            return this.translate.instant('VALIDATION.REQUIRED');
        }

        if (errors['minlength']) {
            return this.translate.instant('VALIDATION.MIN_LENGTH', {
                min: errors['minlength'].requiredLength,
            });
        }

        if (errors['maxlength']) {
            return this.translate.instant('VALIDATION.MAX_LENGTH', {
                max: errors['maxlength'].requiredLength,
            });
        }

        if (errors['futureDate']) {
            return this.translate.instant('VALIDATION.FUTURE_DATE');
        }

        if (errors['invalidDate']) {
            return this.translate.instant('VALIDATION.INVALID_DATE');
        }

        return '';
    }

    public isFieldInvalid(fieldName: string): boolean {
        const control = this.actionForm.get(fieldName);
        return (
            !!control &&
            (control.touched || this.isSubmitted()) &&
            control.invalid
        );
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
