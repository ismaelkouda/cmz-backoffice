import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { ChangePasswordFacade } from '@presentation/pages/authentication/application/services/change-password/change-password.facade';
import { ChangePasswordFormControl } from '@presentation/pages/authentication/presentation/store/change-password/change-password-form.control';
import { ChangePasswordFormValue } from '@presentation/pages/authentication/presentation/store/change-password/change-password-form.value';
import { CHANGE_PASSWORD_FORM_ERROR_MESSAGES } from '@presentation/pages/authentication/presentation/constants/change-password/change-password-form-error-messages.constant';
import { CHANGE_PASSWORD_FORM_KEYS } from '@presentation/pages/authentication/presentation/constants/change-password/change-password-form-keys.constant';
import { FormValidators } from '@presentation/pages/authentication/presentation/constants/form-validators.constants';
import { getControlError } from '@presentation/pages/authentication/presentation/helpers/authentication-form-errors.helper';
import { strongPasswordValidator } from '@shared/presentation/helpers/password-validators.helper';
import { startWith } from 'rxjs';

const confirmPasswordMatchValidator: ValidatorFn = (
    control: AbstractControl
): ValidationErrors | null => {
    const password = control.parent?.get(
        CHANGE_PASSWORD_FORM_KEYS.PASSWORD
    )?.value;
    if (!control.value || !password) {
        return null;
    }
    return control.value === password ? null : { mismatch: true };
};

@Injectable()
export class ChangePasswordStore {
    private readonly fb = inject(FormBuilder);
    private readonly facade = inject(ChangePasswordFacade);

    public readonly loading = this.facade.loading;
    public readonly session = this.facade.items;
    public readonly error = this.facade.error;
    public readonly VALIDATION = FormValidators;

    public readonly form: FormGroup<ChangePasswordFormControl> =
        this.fb.nonNullable.group({
            [CHANGE_PASSWORD_FORM_KEYS.PASSWORD]: [
                '',
                [Validators.required, strongPasswordValidator],
            ],
            [CHANGE_PASSWORD_FORM_KEYS.CONFIRM_PASSWORD]: [
                '',
                [Validators.required, confirmPasswordMatchValidator],
            ],
        });

    private readonly status = toSignal(
        this.form.statusChanges.pipe(startWith(this.form.status)),
        { initialValue: this.form.status }
    );
    public readonly isValid = computed(() => this.status() === 'VALID');

    private get value(): ChangePasswordFormValue {
        return this.form.getRawValue();
    }

    public submit(token: string): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        this.facade.execute({ token, ...this.value });
    }

    public isFieldInvalid(field: keyof ChangePasswordFormControl): boolean {
        const control = this.form.controls[field];
        return control.invalid && control.touched;
    }

    public isFieldValid(field: keyof ChangePasswordFormControl): boolean {
        const control = this.form.controls[field];
        return control.valid && control.touched;
    }

    public isFieldTouched(field: keyof ChangePasswordFormControl): boolean {
        const control = this.form.controls[field];
        return control.touched;
    }

    public getFieldError(
        field: keyof ChangePasswordFormControl
    ): string | null {
        return getControlError(
            this.form.controls[field],
            CHANGE_PASSWORD_FORM_ERROR_MESSAGES[field]
        );
    }
}
