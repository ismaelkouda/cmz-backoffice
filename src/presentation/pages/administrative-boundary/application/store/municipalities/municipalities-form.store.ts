import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MunicipalitiesFindOneFacade } from '@pages/administrative-boundary/application/services/municipalities/municipalities-find-one.facade';
import { MunicipalitiesFacade } from '@pages/administrative-boundary/application/services/municipalities/municipalities.facade';
import { RegionsSelectFacade } from '@pages/administrative-boundary/application/services/regions/regions-select.facade';
import { MunicipalitiesFormHelperService } from '@pages/administrative-boundary/domain/services/municipalities/municipalities-form-helper.service';
import { FormValidators } from '@pages/administrative-boundary/domain/validators/form-validators';
import { MunicipalitiesFormControl } from '@presentation/pages/administrative-boundary/application/store/municipalities/municipalities-form.control';
import { MunicipalitiesFindOneEntity } from '@presentation/pages/administrative-boundary/domain/entities/municipalities/municipalities-find-one.entity';
import { startWith } from 'rxjs';

export type FormMode = 'create' | 'edit' | 'view';

@Injectable()
export class MunicipalitiesFormStore {
    private readonly fb = inject(FormBuilder);
    private readonly facade = inject(MunicipalitiesFindOneFacade);
    private readonly submitFacade = inject(MunicipalitiesFacade);
    private readonly helper = inject(MunicipalitiesFormHelperService);
    private readonly regionsFacade = inject(RegionsSelectFacade);

    private readonly item = this.facade.items;
    public readonly loading = this.facade.loading;
    private readonly createInitialized = signal(false);
    private readonly editInitialized = signal(false);
    private readonly editingId = signal<string | null>(null);
    private readonly formMode = signal<FormMode>('create');
    private isInternalUpdate = false;

    private readonly initialValue = {
        code: '',
        name: '',
        region: '',
        department: '',
        description: '',
    };

    public readonly form: FormGroup<MunicipalitiesFormControl> =
        this.fb.nonNullable.group<MunicipalitiesFormControl>({
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
            department: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            description: new FormControl('', {
                nonNullable: true,
                validators: [
                    Validators.minLength(FormValidators.DESCRIPTION.MIN),
                    Validators.maxLength(FormValidators.DESCRIPTION.MAX),
                    Validators.pattern(FormValidators.DESCRIPTION.PATTERN),
                ],
            }),
        });

    public readonly status = toSignal(
        this.form.statusChanges.pipe(startWith(this.form.status)),
        { initialValue: this.form.status }
    );
    public readonly isSubmitting = computed(
        () => this.submitFacade.actionState() === 'loading'
    );
    public readonly isValid = computed(() => this.status() === 'VALID');
    public readonly isCreateMode = computed(() => this.formMode() === 'create');
    public readonly isEditMode = computed(() => this.formMode() === 'edit');
    public readonly isViewMode = computed(() => this.formMode() === 'view');

    public readonly regions = toSignal(this.regionsFacade.items$, {
        initialValue: [],
    });
    public readonly loadingRegions = toSignal(this.regionsFacade.isLoading$, {
        initialValue: false,
    });
    public readonly selectedRegion = toSignal(
        this.form.controls.region.valueChanges,
        { initialValue: this.form.controls.region.value }
    );

    public readonly departments = computed(() => {
        const regionId = this.selectedRegion();
        if (!regionId) {
            return [];
        }
        const region = this.regions().find((r) => r.value === regionId);
        return region?.departments ?? [];
    });

    private readonly isDepartmentDisabled = computed(
        () => !this.selectedRegion()
    );

    constructor() {
        this.regionsFacade.readAll();
        this.initializeFormEffect();
        this.initializeDisableFormEffect();
        this.initializeSubmitSuccessEffect();
        this.handleRegionChanges();
    }
    private handleRegionChanges(): void {
        effect(() => {
            if (this.isInternalUpdate) {
                return;
            }

            const region = this.selectedRegion();
            const departmentControl = this.form.controls.department;
            const availableDepartments = this.departments();

            if (!region) {
                departmentControl.disable({ emitEvent: false });
                departmentControl.reset('', { emitEvent: false });
                return;
            }

            departmentControl.enable({ emitEvent: false });

            const currentDeptValue = departmentControl.value;
            const stillExists = availableDepartments.some(
                (dept) => dept.value === currentDeptValue
            );

            if (!stillExists && currentDeptValue) {
                departmentControl.reset('', { emitEvent: false });
            }
        });
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

    private patchForm(item: MunicipalitiesFindOneEntity): void {
        this.isInternalUpdate = true;

        this.form.patchValue(
            {
                code: item.code,
                name: item.name,
                region: item.region,
                description: item.description,
                department: item.department,
            },
            { emitEvent: false }
        );

        this.form.controls.region.updateValueAndValidity({ emitEvent: true });

        if (item.region) {
            this.form.controls.department.enable({ emitEvent: false });
        }

        this.isInternalUpdate = false;
    }

    private initializeDisableFormEffect(): void {
        effect(() => {
            const shouldDisable = this.isViewMode() || this.isSubmitting();
            if (shouldDisable) {
                this.form.disable({ emitEvent: false });
            } else {
                this.form.enable({ emitEvent: false });
            }
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
        this.reset();
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
        this.helper.navigateToMunicipalitiesList();
    }

    public reset(): void {
        this.isInternalUpdate = true;
        this.form.reset(this.initialValue, { emitEvent: false });
        this.form.controls.department.disable({ emitEvent: false });
        this.form.controls.region.updateValueAndValidity({ emitEvent: true });
        this.isInternalUpdate = false;
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
            this.submitFacade.update({ uniqId: editingId, ...payload });
        } else {
            this.submitFacade.create(payload);
        }
    }

    private markFormAsTouched(): void {
        Object.values(this.form.controls).forEach((control) =>
            control.markAsTouched()
        );
    }

    private resetInternalState(): void {
        this.createInitialized.set(false);
        this.editInitialized.set(false);
    }
}
