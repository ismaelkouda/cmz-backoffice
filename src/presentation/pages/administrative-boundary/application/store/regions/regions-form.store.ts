import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { RegionsFindOneFacade } from '@pages/administrative-boundary/application/services/regions/regions-find-one.facade';
import { RegionsFacade } from '@pages/administrative-boundary/application/services/regions/regions.facade';
import { RegionsFormHelperService } from '@pages/administrative-boundary/domain/services/regions/regions-form-helper.service';
import { FormValidators } from '@pages/administrative-boundary/domain/validators/form-validators';
import { RegionsFormControl } from '@presentation/pages/administrative-boundary/application/store/regions/regions-form.control';
import { RegionsFindOneEntity } from '@presentation/pages/administrative-boundary/domain/entities/regions/regions-find-one.entity';
import { startWith } from 'rxjs';

export type FormMode = 'create' | 'edit' | 'view';

@Injectable()
export class RegionsFormStore {
    private readonly fb = inject(FormBuilder);
    private readonly facade = inject(RegionsFindOneFacade);
    private readonly submitFacade = inject(RegionsFacade);
    private readonly helper = inject(RegionsFormHelperService);
    private readonly item = this.facade.items;
    public readonly loading = this.facade.loading;
    private readonly createInitialized = signal(false);
    private readonly editInitialized = signal(false);
    private readonly editingId = signal<string | null>(null);
    private readonly formMode = signal<FormMode>('create');

    private readonly initialValue = {
        name: '',
        description: '',
        reportTypes: [],
        operators: [],
        permissions: [],
    };

    public readonly form: FormGroup<RegionsFormControl> =
        this.fb.nonNullable.group<RegionsFormControl>({
            code: new FormControl('', {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.minLength(FormValidators.CODE.MIN),
                    Validators.maxLength(FormValidators.CODE.MAX),
                    Validators.pattern(FormValidators.CODE.PATTERN),
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
        this.helper.navigateToRegionsList();
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

    private patchForm(item: RegionsFindOneEntity): void {
        this.form.patchValue(
            {
                code: item.code,
                name: item.name,
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
