import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { TasksActionsFacade } from '@pages/processing/application/services/tasks/tasks-actions.facade';
import { TasksActionsFormControl } from '@pages/processing/domain/controls/tasks/tasks-actions-form.control';
import { TasksActionsVmProps } from '@pages/processing/presentation/adapters/tasks/actions-treatment/actions-treatments-vm-props.interface';
import { Conformity } from '@presentation/pages/processing/domain/enums/tasks/tasks-actions-conformity.enum';
import { parseFrenchDate } from '@shared/domain/functions/format-date';
import { startWith } from 'rxjs';

@Injectable()
export class ActionsTreatmentFormStore {
    private readonly fb = inject(FormBuilder);
    private readonly facade = inject(TasksActionsFacade);
    private readonly translate = inject(TranslateService);

    private readonly editingId = signal<string | null>(null);
    private readonly modalOpen = signal(false);
    private readonly lastSuccessCount = signal(0);

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
        {
            initialValue: this.form.status,
        }
    );

    readonly operator = toSignal(
        this.form.controls.operator.valueChanges.pipe(
            startWith(this.form.controls.operator.value)
        ),
        {
            initialValue: this.form.controls.operator.value,
        }
    );

    readonly isEditMode = computed(() => this.editingId() !== null);
    readonly isOpen = this.modalOpen.asReadonly();
    readonly isSubmitting = computed(
        () => this.facade.actionState() === 'loading'
    );
    readonly isValid = computed(() => this.status() === 'VALID');

    private readonly successEffect = effect(() => {
        const currentSuccess = this.facade.actionSuccess();

        if (
            currentSuccess === 0 ||
            currentSuccess === this.lastSuccessCount()
        ) {
            return;
        }

        this.lastSuccessCount.set(currentSuccess);

        if (this.modalOpen()) {
            this.close();
        }
    });

    openCreate(operators: { value: string; label: string }[]): void {
        this.editingId.set(null);

        this.form.reset({
            date: null,
            type: '',
            description: '',
            shouldNotifyUser: false,
            isConform: null,
            operator: operators.length === 1 ? operators[0].value : '',
        });

        this.modalOpen.set(true);
    }

    openEdit(item: TasksActionsVmProps): void {
        console.log('item: ', item);
        this.editingId.set(item.uniqId);

        this.form.patchValue({
            date: item.date ? parseFrenchDate(item.date) : null,
            type: item.code,
            description: item.description,
            shouldNotifyUser: item.shouldNotifyUser,
            isConform: item.isConform,
            operator: this.translate.instant(item.operators[0]) ?? '',
        });

        this.modalOpen.set(true);
    }

    close(): void {
        this.modalOpen.set(false);
        this.editingId.set(null);
        this.form.reset();
    }

    selectOperator(operator: string): void {
        this.form.controls.operator.setValue(operator);
    }

    submit(reportUniqId: string): void {
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
}
