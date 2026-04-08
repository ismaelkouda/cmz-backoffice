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
    selector: 'app-management-callback',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TranslateModule,
        SelectModule,
        TextareaModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './management-callback.component.html',
    styleUrls: ['./management-callback.component.scss'],
})
export class ManagementCallbackComponent {
    public readonly form = input.required<FormGroup<ManagementFormControl>>();
    public readonly submitting = input<boolean>(false);
    public readonly submitLabel = input.required<string>();
    public readonly loading = input.required<boolean>();
    public readonly showApprovalSection = input<boolean>(false);
    public readonly callbackTypeOptions = input<FilterOption[]>([]);

    public readonly cancelForm = output();
    public readonly submitForm = output();
    public readonly managementTypeChange = output<string>();

    private readonly _expanded = signal<boolean>(true);

    @Input()
    set expanded(value: boolean) {
        this._expanded.set(value);
    }

    readonly expandedState = computed(() => this._expanded());

    protected toggle(): void {
        this._expanded.update((v) => !v);
    }

    private readonly managementType = signal<string>('');
    protected readonly shouldShowCallbackTypeField = computed(
        () => this.managementType() === 'callback'
    );
    private readonly managementTypeSyncEffect = effect((onCleanup) => {
        const form = this.form();

        if (!form) {
            return;
        }

        const control = form.get('managementType');
        if (!control) {
            return;
        }

        this.managementType.set(control.value);

        const sub = control.valueChanges.subscribe((value) => {
            this.managementType.set(value);
        });

        onCleanup(() => sub.unsubscribe());
    });

    private readonly callbackTypeStateEffect = effect(() => {
        const form = this.form();
        const managementType = this.managementType();

        if (!form) {
            return;
        }

        const callbackTypeControl = form.get('callbackType');
        callbackTypeControl?.disable({ emitEvent: false });
        if (!callbackTypeControl) {
            return;
        }

        if (managementType === 'edit') {
            callbackTypeControl.setValue(null, { emitEvent: false });
            callbackTypeControl.clearValidators();
            callbackTypeControl.disable({ emitEvent: false });
        } else if (managementType === 'callback') {
            callbackTypeControl.enable({ emitEvent: false });
            callbackTypeControl.setValidators([Validators.required]);
        }

        callbackTypeControl.updateValueAndValidity({ emitEvent: false });
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

    protected isManagementType(value: 'edit' | 'callback'): boolean {
        return this.form()?.get('managementType')?.value === value;
    }

    protected isFieldInvalid(fieldName: keyof ManagementFormControl): boolean {
        const control = this.form()?.get(fieldName);
        return !!(control?.invalid && control?.touched);
    }

    protected onManagementTypeChange(
        managementType: 'edit' | 'callback'
    ): void {
        const form = this.form();
        form.patchValue({ managementType });
        form.get('managementType')?.markAsTouched();
        this.managementTypeChange.emit(managementType);
    }
}
