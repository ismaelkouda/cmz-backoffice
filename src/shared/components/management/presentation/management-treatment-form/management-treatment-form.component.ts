import { CommonModule } from '@angular/common';
import {
    Component,
    input,
    output,
    computed,
    effect,
    ChangeDetectionStrategy,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';

import { FilterOption } from '@shared/components/filter/filter.types';

import { ManagementFormControl } from '../../domain/controls/management-form-control';

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
    templateUrl: './management-treatment-form.component.scss',
    styleUrls: ['./management-treatment-form.component.scss'],
})
export class ManagementTreatmentFormComponent {
    public readonly form = input.required<FormGroup<ManagementFormControl>>();
    public readonly expanded = input<boolean>(true);
    public readonly submitting = input<boolean>(false);
    public readonly submitLabel = input.required<string>();
    public readonly showApprovalSection = input<boolean>(false);
    public readonly motifOptions = input<FilterOption[]>([]);

    public readonly treatmentToggle = output();
    public readonly cancelForm = output();
    public readonly submitForm = output();
    public readonly decisionChange = output<string>();

    protected readonly shouldShowReasonField = computed((): boolean => {
        return this.isDecision('rejected');
    });

    protected readonly isFormInvalid = computed((): boolean => {
        return this.form()?.invalid ?? true;
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

    constructor() {
        effect(() => {
            const form = this.form();
            const decision = form.get('decision')?.value;

            // Si on passe de rejected à autre chose, on peut notifier ou faire des actions
            if (decision !== 'rejected') {
                // Optionnel : Logique supplémentaire quand on quitte le mode rejet
            }
        });
    }

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

        if (decision === 'accepted') {
            form.patchValue({ reason: '' });
        }

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
