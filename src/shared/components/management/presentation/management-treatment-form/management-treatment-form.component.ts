import { CommonModule } from '@angular/common';
import {
    Component,
    input,
    output,
    computed,
    effect,
    ChangeDetectionStrategy,
    signal,
    Input,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FilterOption } from '@shared/components/filter/filter.types';
import { ManagementFormControl } from '@shared/components/management/domain/controls/management-form-control';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';

@Component({
    selector: 'app-management-treatment-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TranslateModule,
        SelectModule,
        TextareaModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './management-treatment-form.component.html',
    styleUrls: ['./management-treatment-form.component.scss'],
})
export class ManagementTreatmentFormComponent {
    public readonly form = input.required<FormGroup<ManagementFormControl>>();
    public readonly submitting = input<boolean>(false);
    public readonly submitLabel = input.required<string>();
    public readonly loading = input.required<boolean>();
    public readonly showApprovalSection = input<boolean>(false);
    public readonly motifOptions = input<FilterOption[]>([]);

    public readonly cancelForm = output();
    public readonly submitForm = output();
    public readonly decisionChange = output<string>();

    private readonly _expanded = signal<boolean>(true);

    @Input()
    set expanded(value: boolean) {
        this._expanded.set(value);
    }

    readonly expandedState = computed(() => this._expanded());

    protected toggle(): void {
        this._expanded.update((v) => !v);
    }

    private readonly decision = signal<string>('');
    protected readonly shouldShowReasonField = computed(
        () => this.decision() === 'rejected'
    );
    private readonly decisionSyncEffect = effect((onCleanup) => {
        const form = this.form();

        if (!form) {
            return;
        }

        const control = form.get('decision');
        if (!control) {
            return;
        }

        this.decision.set(control.value);

        const sub = control.valueChanges.subscribe((value) => {
            this.decision.set(value);
        });

        onCleanup(() => sub.unsubscribe());
    });

    protected readonly formErrors = computed((): Record<string, string[]> => {
        const form = this.form();
        const errors: Record<string, string[]> = {};

        if (!form) {
            return errors;
        }

        Object.keys(form.controls).forEach((key) => {
            const control = form.get(key);
            if (control?.errors) {
                errors[key] = Object.keys(control.errors);
            }
        });

        return errors;
    });

    protected readonly hasErrors = computed((): boolean => {
        return Object.keys(this.formErrors()).length > 0;
    });

    protected readonly isFormValid = computed((): boolean => {
        return this.form()?.valid ?? false;
    });

    protected getFieldError(
        fieldName: keyof ManagementFormControl
    ): string | null {
        const control = this.form()?.get(fieldName);

        if (!control?.errors || !control.touched) {
            return null;
        }

        const errors = control.errors;

        if (errors['required']) {
            return 'Ce champ est requis';
        }

        if (errors['minlength']) {
            const requiredLength = errors['minlength'].requiredLength;
            return `Minimum ${requiredLength} caractères requis`;
        }

        if (errors['maxlength']) {
            const requiredLength = errors['maxlength'].requiredLength;
            return `Maximum ${requiredLength} caractères autorisés`;
        }

        return 'Champ invalide';
    }

    private readonly reasonStateEffect = effect(() => {
        const form = this.form();
        const decision = this.decision();

        if (!form) {
            return;
        }

        const reasonControl = form.get('reason');
        if (!reasonControl) {
            return;
        }

        if (decision === 'accepted') {
            reasonControl.setValue(null, { emitEvent: false });
            reasonControl.clearValidators();
            reasonControl.disable({ emitEvent: false });
        } else if (decision === 'rejected') {
            reasonControl.enable({ emitEvent: false });
            reasonControl.setValidators([Validators.required]);
        }

        reasonControl.updateValueAndValidity({ emitEvent: false });
    });

    protected isDecision(value: 'accepted' | 'rejected'): boolean {
        return this.form()?.get('decision')?.value === value;
    }

    protected isFieldInvalid(fieldName: keyof ManagementFormControl): boolean {
        const control = this.form()?.get(fieldName);
        return !!(control?.invalid && control?.touched);
    }

    protected onDecisionChange(decision: 'accepted' | 'rejected'): void {
        const form = this.form();
        form.patchValue({ decision });
        form.get('decision')?.markAsTouched();
        this.decisionChange.emit(decision);
    }

    protected getCommentValidationMessage(): string {
        const control = this.form()?.get('comment');

        if (control?.errors?.['required']) {
            return 'MANAGEMENT.TREATMENT.TAKE_ACTION.VALIDATION.COMMENT_REQUIRED';
        }

        if (control?.errors?.['minlength']) {
            return 'MANAGEMENT.TREATMENT.TAKE_ACTION.VALIDATION.COMMENT_MINLENGTH';
        }

        if (control?.errors?.['maxlength']) {
            return 'MANAGEMENT.TREATMENT.TAKE_ACTION.VALIDATION.COMMENT_MAXLENGTH';
        }

        return '';
    }
}
