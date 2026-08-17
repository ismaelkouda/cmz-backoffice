import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ForgotPasswordFacade } from '@presentation/pages/authentication/application/services/forgot-password/forgot-password.facade';
import { ForgotPasswordFormControl } from '@presentation/pages/authentication/presentation/store/forgot-password/forgot-password-form.control';
import { ForgotPasswordFormValue } from '@presentation/pages/authentication/presentation/store/forgot-password/forgot-password-form.value';
import { FORGOT_PASSWORD_FORM_ERROR_MESSAGES } from '@presentation/pages/authentication/presentation/constants/forgot-password/forgot-password-form-error-messages.constant';
import { FORGOT_PASSWORD_FORM_KEYS } from '@presentation/pages/authentication/presentation/constants/forgot-password/forgot-password-form-keys.constant';
import { FormValidators } from '@presentation/pages/authentication/presentation/constants/form-validators.constants';
import { getControlError } from '@presentation/pages/authentication/presentation/helpers/authentication-form-errors.helper';
import { startWith } from 'rxjs';

@Injectable()
export class ForgotPasswordStore {
    private readonly fb = inject(FormBuilder);
    private readonly facade = inject(ForgotPasswordFacade);

    public readonly loading = this.facade.loading;
    public readonly error = this.facade.error;
    public readonly session = this.facade.items;
    public readonly VALIDATION = FormValidators;

    public readonly form: FormGroup<ForgotPasswordFormControl> =
        this.fb.nonNullable.group({
            [FORGOT_PASSWORD_FORM_KEYS.EMAIL]: [
                '',
                [
                    Validators.required,
                    Validators.pattern(FormValidators.EMAIL.PATTERN),
                ],
            ],
        });

    private readonly status = toSignal(
        this.form.statusChanges.pipe(startWith(this.form.status)),
        { initialValue: this.form.status }
    );
    public readonly isValid = computed(() => this.status() === 'VALID');

    private get value(): ForgotPasswordFormValue {
        return this.form.getRawValue();
    }

    public submit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        this.facade.execute(this.value);
    }

    public isFieldInvalid(field: keyof ForgotPasswordFormControl): boolean {
        const control = this.form.controls[field];
        return control.invalid && control.touched;
    }

    public isFieldValid(field: keyof ForgotPasswordFormControl): boolean {
        const control = this.form.controls[field];
        return control.valid && control.touched;
    }

    public isFieldTouched(field: keyof ForgotPasswordFormControl): boolean {
        const control = this.form.controls[field];
        return control.touched;
    }

    public getFieldError(
        field: keyof ForgotPasswordFormControl
    ): string | null {
        return getControlError(
            this.form.controls[field],
            FORGOT_PASSWORD_FORM_ERROR_MESSAGES[field]
        );
    }
}
