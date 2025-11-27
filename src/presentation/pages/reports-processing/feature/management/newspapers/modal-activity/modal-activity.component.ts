import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    computed,
    effect,
    inject,
    input,
    output,
    signal,
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
import { ModalActivityFormControlEntity } from '@presentation/pages/reports-processing/domain/entities/management/newspapers/modal-activity/modal-activity-fom-control.entity';
import { ModalActivityPayloadEntity } from '@presentation/pages/reports-processing/domain/entities/management/newspapers/modal-activity/modal-activity-payload.entity';
import { NewspapersEntity } from '@presentation/pages/reports-processing/domain/entities/management/newspapers/newspapers.entity';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { Subject, takeUntil } from 'rxjs';

export type ActivityModalMode = 'create' | 'edit';

@Component({
    selector: 'app-modal-activity',
    standalone: true,
    templateUrl: './modal-activity.component.html',
    styleUrls: ['./modal-activity.component.scss'],
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
export class ModalActivityComponent implements OnInit, OnDestroy {
    public readonly visible = input<boolean>(false);
    public readonly reportUniqId = input.required<string>();
    public readonly activity = input<NewspapersEntity | null>(null);

    public readonly visibleChange = output<boolean>();
    public readonly activityCreate = output<ModalActivityPayloadEntity>();
    public readonly activityUpdate = output<{
        id: string;
        data: ModalActivityPayloadEntity;
    }>();
    public readonly closed = output<void>();

    private readonly fb = inject(FormBuilder);
    private readonly translate = inject(TranslateService);
    private readonly destroy$ = new Subject<void>();

    public readonly mode = computed<ActivityModalMode>(() =>
        this.activity() ? 'edit' : 'create'
    );

    public readonly modalTitle = computed(() => {
        const key = this.mode() === 'create' ? 'CREATE' : 'EDIT';
        return this.translate.instant(`MANAGEMENT.ACTIVITY.MODAL.TITLE.${key}`);
    });

    public readonly submitButtonLabel = computed(() => {
        const key = this.mode() === 'create' ? 'CREATE' : 'UPDATE';
        return this.translate.instant(`MANAGEMENT.ACTIVITY.BUTTONS.${key}`);
    });

    public readonly activityTypes = computed(() => [
        {
            value: 'ANALYSIS',
            label: this.translate.instant('MANAGEMENT.ACTIVITY.TYPES.ANALYSIS'),
        },
        {
            value: 'TREATMENT',
            label: this.translate.instant(
                'MANAGEMENT.ACTIVITY.TYPES.TREATMENT'
            ),
        },
        {
            value: 'VERIFICATION',
            label: this.translate.instant(
                'MANAGEMENT.ACTIVITY.TYPES.VERIFICATION'
            ),
        },
        {
            value: 'CORRECTION',
            label: this.translate.instant(
                'MANAGEMENT.ACTIVITY.TYPES.CORRECTION'
            ),
        },
        {
            value: 'VALIDATION',
            label: this.translate.instant(
                'MANAGEMENT.ACTIVITY.TYPES.VALIDATION'
            ),
        },
        {
            value: 'OTHER',
            label: this.translate.instant('MANAGEMENT.ACTIVITY.TYPES.OTHER'),
        },
    ]);

    public readonly today = new Date().toISOString().split('T')[0];

    public activityForm: FormGroup<ModalActivityFormControlEntity>;
    private readonly _isSubmitted = signal<boolean>(false);
    public readonly isSubmitted = this._isSubmitted.asReadonly();

    public readonly characterCount = computed(
        () => this.activityForm.get('description')?.value?.length || 0
    );

    public readonly maxDescriptionLength = 1000;

    @ViewChild('datePicker') datePicker: any;

    public openDatePicker(): void {
        if (this.datePicker && this.datePicker.toggle) {
            this.datePicker.toggle();
        }
    }
    constructor() {
        this.activityForm = this.buildForm();
    }

    ngOnInit(): void {
        this.setupFormListeners();
        this.initializeForm();
        this.setupModeWatcher();
    }

    private initializeForm(): void {
        if (this.mode() === 'edit' && this.activity()) {
            this.patchFormWithActivityData();
        } else {
            this.initializeFormForCreation();
        }
    }

    private patchFormWithActivityData(): void {
        const activity = this.activity();

        if (activity) {
            // ✅ S'assurer que la valeur est bien formatée pour le datepicker
            const formattedDate = this.formatDateForPicker(activity.date);

            this.activityForm.patchValue({
                report_uniq_id: this.reportUniqId(),
                date: formattedDate,
                type: activity.type || '', // ✅ Gérer le cas où type est undefined
                description: activity.description,
            });

            // ✅ Forcer la mise à jour de l'état du formulaire
            this.activityForm.updateValueAndValidity();
        }
    }
    private formatDateForPicker(dateString: string): string {
        if (!dateString) return '';

        try {
            // Convertir "2025-11-25" en Date object pour PrimeNG
            const date = new Date(dateString);
            return date.toISOString().split('T')[0]; // Retourner "2025-11-25"
        } catch {
            return dateString;
        }
    }
    private initializeFormForCreation(): void {
        this.activityForm.patchValue({
            report_uniq_id: this.reportUniqId(),
            date: this.today,
        });
    }

    public onModalVisibilityChange(visible: boolean): void {
        if (!visible) {
            this.closeModal();
        }
    }

    private buildForm(): FormGroup<ModalActivityFormControlEntity> {
        return this.fb.group<ModalActivityFormControlEntity>({
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
        // Utiliser un effect pour réagir aux changements de mode
        effect(() => {
            const mode = this.mode();
            const dateControl = this.activityForm.get('date');

            if (mode === 'edit') {
                dateControl?.disable(); // ✅ Correct: utiliser les méthodes du reactive forms
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
        this.activityForm.valueChanges
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

        if (this.activityForm.valid) {
            const formData = this.prepareFormData();

            if (this.mode() === 'edit' && this.activity()?.id) {
                this.activityUpdate.emit({
                    id: this.activity()!.id!,
                    data: formData,
                });
            } else {
                this.activityCreate.emit(formData);
            }
        } else {
            this.markAllFieldsAsTouched();
        }
    }

    private prepareFormData(): ModalActivityPayloadEntity {
        const formValue = this.activityForm.getRawValue();

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
            return dateValue; // Déjà au format YYYY-MM-DD
        }

        return dateValue;
    }

    private markAllFieldsAsTouched(): void {
        Object.keys(this.activityForm.controls).forEach((key) => {
            this.activityForm.get(key)?.markAsTouched();
        });
    }

    private closeModal(): void {
        this.visibleChange.emit(false);
        this.closed.emit();
        this.resetForm();
    }

    private resetForm(): void {
        this.activityForm.reset();
        this._isSubmitted.set(false);
    }

    public getFieldError(fieldName: string): string {
        const control = this.activityForm.get(fieldName);

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
        const control = this.activityForm.get(fieldName);
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
