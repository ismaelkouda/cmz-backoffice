import { CommonModule } from '@angular/common';
import {
    Component,
    input,
    output,
    computed,
    ChangeDetectionStrategy,
    signal,
    Input,
    inject,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FilterOption } from '@shared/components/filter/filter.types';
import { ManagementFormControl } from '@shared/components/management/domain/controls/management-form-control';
import { ManagementFormStore } from '@shared/components/management/presentation/store/management-form.store';
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
    public readonly store = inject(ManagementFormStore);
    public readonly loading = input.required<boolean>();
    public readonly submitLabel = input.required<string>();
    public readonly showApprovalSection = input<boolean>(false);
    public readonly motifOptions = input<FilterOption[]>([]);
    public readonly submitting = input<boolean>(false);

    public readonly cancelForm = output();
    public readonly submitForm = output();
    public readonly decisionChange = output<string>();

    private readonly _expanded = signal<boolean>(true);
    @Input()
    set expanded(value: boolean) {
        this._expanded.set(value);
    }
    readonly expandedState = computed(() => this._expanded());

    protected readonly shouldShowReasonField = this.store.shouldShowReasonField;
    protected readonly formErrors = computed(() => this.store.formErrors());
    protected readonly hasErrors = computed(() => this.store.hasErrors());

    protected toggle(): void {
        this._expanded.update((v) => !v);
    }

    protected isDecision(value: 'accepted' | 'rejected'): boolean {
        return this.store.decision() === value;
    }

    protected isFieldInvalid(fieldName: keyof ManagementFormControl): boolean {
        const control = this.store.form.get(fieldName);
        return !!(control?.invalid && control?.touched);
    }

    protected getFieldError(
        fieldName: keyof ManagementFormControl
    ): string | null {
        const control = this.store.form.get(fieldName);
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

    protected getCommentValidationMessage(): string {
        const control = this.store.form.get('comment');
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

    protected onDecisionChange(decision: 'accepted' | 'rejected'): void {
        this.store.setDecision(decision);
        this.decisionChange.emit(decision);
    }
}
