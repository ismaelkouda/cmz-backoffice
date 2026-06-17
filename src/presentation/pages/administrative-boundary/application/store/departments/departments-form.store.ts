import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { DepartmentsFindOneFacade } from '@pages/administrative-boundary/application/services/departments/departments-find-one.facade';
import { DepartmentsFacade } from '@pages/administrative-boundary/application/services/departments/departments.facade';
import { DepartmentsFormHelperService } from '@pages/administrative-boundary/domain/services/departments/departments-form-helper.service';
import { FormValidators } from '@pages/administrative-boundary/domain/validators/form-validators';
import { DepartmentsFormControl } from '@presentation/pages/administrative-boundary/application/store/departments/departments-form.control';
import { DepartmentsFindOneEntity } from '@presentation/pages/administrative-boundary/domain/entities/departments/departments-find-one.entity';
import { startWith } from 'rxjs';

export type FormMode = 'create' | 'edit' | 'view';

@Injectable()
export class DepartmentsFormStore {
    private readonly fb = inject(FormBuilder);
    private readonly facade = inject(DepartmentsFindOneFacade);
    private readonly submitFacade = inject(DepartmentsFacade);
    private readonly helper = inject(DepartmentsFormHelperService);
    private readonly item = this.facade.items;
    public readonly loading = this.facade.loading;
    private readonly createInitialized = signal(false);
    private readonly editInitialized = signal(false);
    private readonly editingId = signal<string | null>(null);
    private readonly formMode = signal<FormMode>('create');

    private readonly initialValue = {
        code: '',
        name: '',
        region: '',
        description: '',
    };

    public readonly form: FormGroup<DepartmentsFormControl> =
        this.fb.nonNullable.group<DepartmentsFormControl>({
            code: new FormControl('', {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.minLength(FormValidators.CODE.MIN),
                    Validators.maxLength(FormValidators.CODE.MAX),
                    Validators.pattern(FormValidators.CODE.PATTERN),
                ],
            }),
            population: new FormControl(0, {
                nonNullable: true,
                validators: [
                    Validators.required,
                    // Validators.minLength(FormValidators.POPULATION.MIN),
                    // Validators.maxLength(FormValidators.POPULATION.MAX),
                    // Validators.pattern(FormValidators.POPULATION.PATTERN),
                ],
            }),
            infrastructure: new FormControl(0, {
                nonNullable: true,
                validators: [
                    Validators.required,
                    // Validators.minLength(FormValidators.INFRASTRUCTURE.MIN),
                    // Validators.maxLength(FormValidators.INFRASTRUCTURE.MAX),
                    // Validators.pattern(FormValidators.INFRASTRUCTURE.PATTERN),
                ],
            }),
            name: new FormControl('', {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.minLength(FormValidators.NAME.MIN),
                    Validators.maxLength(FormValidators.NAME.MAX),
                    Validators.pattern(FormValidators.NAME.PATTERN),
                ],
            }),
            region: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            description: new FormControl('', {
                nonNullable: true,
            }),
        });

    public readonly status = toSignal(
        this.form.statusChanges.pipe(startWith(this.form.status)),
        {
            initialValue: this.form.status,
        }
    );

    public readonly isSubmitting = computed(
        () => this.submitFacade.actionState() === 'loading'
    );

    public readonly isValid = computed(() => this.status() === 'VALID');
    public readonly isCreateMode = computed(() => this.formMode() === 'create');
    public readonly isEditMode = computed(() => this.formMode() === 'edit');
    public readonly isViewMode = computed(() => this.formMode() === 'view');

    constructor() {
        this.initializeFormEffect();
        this.initializeDisableFormEffect();
        this.initializeSubmitSuccessEffect();
    }

    private initializeFormEffect(): void {
        effect(() => {
            const item = this.item();
            if (!item || this.editInitialized()) {
                return;
            }
            this.patchForm(item);
            this.editInitialized.set(true);
        });
    }

    private initializeDisableFormEffect(): void {
        effect(() => {
            const shouldDisable = this.isViewMode() || this.isSubmitting();
            if (shouldDisable) {
                this.form.disable({
                    emitEvent: false,
                });
                return;
            }
            this.form.enable({
                emitEvent: false,
            });
        });
    }

    private initializeSubmitSuccessEffect(): void {
        effect(() => {
            const success = this.submitFacade.actionSuccess();
            if (success === 0) {
                return;
            }
            this.close();
        });
    }

    public openCreate(): void {
        this.submitFacade.resetActionSuccess();
        this.resetInternalState();
        this.formMode.set('create');
        this.editingId.set(null);
    }

    public openEdit(uniqId: string): void {
        this.submitFacade.resetActionSuccess();
        this.resetInternalState();
        this.formMode.set('edit');
        this.editingId.set(uniqId);
        this.facade.read({ uniqId });
    }

    public openView(uniqId: string): void {
        this.resetInternalState();
        this.formMode.set('view');
        this.editingId.set(uniqId);
        this.facade.read({ uniqId });
    }

    public close(): void {
        this.resetInternalState();
        this.editingId.set(null);
        this.facade.reset();
        this.helper.navigateToDepartmentsList();
    }

    public reset(): void {
        this.form.reset(this.initialValue);
    }

    public submit(): void {
        if (this.form.invalid) {
            this.markFormAsTouched();
            return;
        }
        this.submitFacade.resetActionSuccess();
        const payload = this.form.getRawValue();
        const editingId = this.editingId();
        if (editingId) {
            this.submitFacade.update({
                uniqId: editingId,
                ...payload,
            });
            return;
        }
        this.submitFacade.create(payload);
    }

    private patchForm(item: DepartmentsFindOneEntity): void {
        this.form.patchValue(
            {
                code: item.code,
                name: item.name,
                population: item.population,
                infrastructure: item.infrastructure,
                region: item.region,
                description: item.description,
            },
            {
                emitEvent: false,
            }
        );
    }

    private markFormAsTouched(): void {
        Object.values(this.form.controls).forEach((control) => {
            control.markAsTouched();
        });
    }

    private resetInternalState(): void {
        this.createInitialized.set(false);
        this.editInitialized.set(false);
    }
}
