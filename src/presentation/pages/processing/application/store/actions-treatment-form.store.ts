import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { TasksActionsTypeFacade } from '@pages/processing/application/services/tasks/tasks-actions-type.facade';
import { TasksActionsFacade } from '@pages/processing/application/services/tasks/tasks-actions.facade';
import { TasksActionsFormControl } from '@pages/processing/domain/controls/tasks/tasks-actions-form.control';
import { TasksActionsVmProps } from '@pages/processing/presentation/adapters/tasks/actions-treatment/actions-treatments-vm-props.interface';
import { Conformity } from '@presentation/pages/processing/domain/enums/tasks/tasks-actions-conformity.enum';
import { parseFrenchDate } from '@shared/domain/functions/format-date';
import { startWith } from 'rxjs';

export type DialogMode = 'create' | 'edit' | 'view';

@Injectable()
export class ActionsTreatmentFormStore {
    private readonly fb = inject(FormBuilder);
    private readonly facade = inject(TasksActionsFacade);
    private readonly actionsTypeFacade = inject(TasksActionsTypeFacade);
    private readonly translate = inject(TranslateService);

    private readonly editingId = signal<string | null>(null);
    private readonly modalOpen = signal(false);
    private readonly lastSuccessCount = signal(0);
    private readonly dialogMode = signal<DialogMode>('create');
    readonly actionsType = toSignal(this.actionsTypeFacade.items$, {
        initialValue: [],
    });
    readonly loadingActionsType = toSignal(this.actionsTypeFacade.isLoading$, {
        initialValue: false,
    });

    readonly form = this.fb.nonNullable.group<TasksActionsFormControl>({
        date: new FormControl<Date | null>(null, {
            nonNullable: true,
            validators: [Validators.required],
        }),
        type: new FormControl<string>('', {
            nonNullable: true,
            validators: [Validators.required],
        }),
        description: new FormControl<string>('', {
            nonNullable: true,
            validators: [Validators.required],
        }),
        shouldNotifyUser: new FormControl<boolean>(false, {
            nonNullable: true,
        }),
        operator: new FormControl<string>('', {
            nonNullable: true,
            validators: [Validators.required],
        }),
        isConform: new FormControl<Conformity | null>(null, {
            nonNullable: true,
            validators: [Validators.required],
        }),
    });

    readonly status = toSignal(
        this.form.statusChanges.pipe(startWith(this.form.status)),
        { initialValue: this.form.status }
    );

    readonly operator = toSignal(
        this.form.controls.operator.valueChanges.pipe(
            startWith(this.form.controls.operator.value)
        ),
        {
            initialValue: this.form.controls.operator.value,
        }
    );

    readonly selectedType = toSignal(
        this.form.controls.type.valueChanges.pipe(
            startWith(this.form.controls.type.value)
        ),
        { initialValue: '' }
    );

    readonly isOpen = this.modalOpen.asReadonly();
    readonly isSubmitting = computed(
        () => this.facade.actionState() === 'loading'
    );
    readonly isValid = computed(() => this.status() === 'VALID');

    readonly isCreateMode = computed(() => this.dialogMode() === 'create');
    readonly isEditMode = computed(() => this.dialogMode() === 'edit');
    readonly isViewMode = computed(() => this.dialogMode() === 'view');

    private readonly disableFormEffect = effect(() => {
        const shouldDisable = this.isViewMode() || this.isSubmitting();
        if (shouldDisable) {
            this.form.disable({ emitEvent: false });
        } else {
            this.form.enable({ emitEvent: false });
        }
    });

    private readonly successEffect = effect(() => {
        const currentSuccess = this.facade.actionSuccess();
        if (!this.modalOpen()) {
            return;
        }
        if (
            currentSuccess === 0 ||
            currentSuccess === this.lastSuccessCount()
        ) {
            return;
        }

        this.lastSuccessCount.set(currentSuccess);
        this.close();
    });

    openCreate(
        uniqId: string,
        availableOperators: { value: string; label: string }[]
    ): void {
        this.dialogMode.set('create');
        this.editingId.set(null);
        this.actionsTypeFacade.readAll({ uniqId }, true);
        this.form.reset({
            date: null,
            type: '',
            description: '',
            shouldNotifyUser: false,
            isConform: null,
            operator:
                availableOperators.length === 1
                    ? availableOperators[0].value
                    : '',
        });
        this.modalOpen.set(true);
    }

    openEdit(uniqId: string, item: TasksActionsVmProps): void {
        this.dialogMode.set('edit');
        this.editingId.set(item.uniqId);
        this.actionsTypeFacade.readAll({ uniqId }, true);
        this.patchValue(item);
        this.modalOpen.set(true);
    }

    openView(uniqId: string, item: TasksActionsVmProps): void {
        this.dialogMode.set('view');
        this.editingId.set(item.uniqId);
        this.actionsTypeFacade.readAll({ uniqId }, true);
        this.patchValue(item);
        this.modalOpen.set(true);
    }

    close(): void {
        this.modalOpen.set(false);
        this.editingId.set(null);
        this.form.reset();
        this.dialogMode.set('create');
    }

    selectOperator(operator: string): void {
        if (this.isViewMode()) {
            return;
        }
        this.form.controls.operator.setValue(operator);
    }

    submit(reportUniqId: string, canEdit = true): void {
        if (!canEdit) {
            console.warn('Submit blocked: user lacks permission.');
            return;
        }

        if (this.form.invalid) {
            Object.keys(this.form.controls).forEach((key) => {
                this.form.get(key)?.markAsTouched();
            });
            return;
        }

        this.lastSuccessCount.set(this.facade.actionSuccess());

        const payload = {
            reportUniqId,
            ...this.form.getRawValue(),
        };
        const editingId = this.editingId();

        if (editingId) {
            this.facade.update({
                ...payload,
                uniqId: editingId,
            });
            return;
        }

        this.facade.create(payload);
    }

    reset(): void {
        this.form.reset();
    }

    private patchValue(item: TasksActionsVmProps) {
        this.form.patchValue({
            date: item.date ? parseFrenchDate(item.date) : null,
            type: item.code,
            description: item.description,
            shouldNotifyUser: item.shouldNotifyUser,
            isConform: item.isConform,
            operator: this.translate.instant(item.operators[0]) ?? '',
        });
    }
}
