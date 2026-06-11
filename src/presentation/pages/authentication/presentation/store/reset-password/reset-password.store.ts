import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResetPasswordFacade } from '@presentation/pages/authentication/application/facade/reset-password/reset-password.facade';
import { ResetPasswordFormControl } from '@presentation/pages/authentication/presentation/store/reset-password/reset-password-form.control';
import { ResetPasswordFormValue } from '@presentation/pages/authentication/presentation/store/reset-password/reset-password-form.value';
import { RESET_PASSWORD_FORM_ERROR_MESSAGES } from '@presentation/pages/authentication/presentation/constants/reset-password/reset-password-form.constant';
import { RESET_PASSWORD_FORM_KEYS } from '@presentation/pages/authentication/presentation/constants/reset-password/reset-password-form-keys.constant';
import { getControlError } from '@presentation/pages/authentication/presentation/helpers/authentication-form-errors.helper';
import { startWith } from 'rxjs';

@Injectable()
export class ResetPasswordStore {
    private readonly fb = inject(FormBuilder);
    private readonly facade = inject(ResetPasswordFacade);

    public readonly loading = this.facade.loading;
    public readonly error = this.facade.error;
    public readonly session = this.facade.items;

    public readonly form: FormGroup<ResetPasswordFormControl> =
        this.fb.nonNullable.group({
            [RESET_PASSWORD_FORM_KEYS.PASSWORD]: [
                '',
                [Validators.required, Validators.minLength(8)],
            ],
            [RESET_PASSWORD_FORM_KEYS.CONFIRM_PASSWORD]: [
                '',
                [Validators.required],
            ],
        });

    private readonly status = toSignal(
        this.form.statusChanges.pipe(startWith(this.form.status)),
        { initialValue: this.form.status }
    );
    public readonly isValid = computed(() => this.status() === 'VALID');

    private get value(): ResetPasswordFormValue {
        return this.form.getRawValue();
    }

    public submit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        this.facade.execute(this.value);
    }

    public isFieldInvalid(field: keyof ResetPasswordFormControl): boolean {
        const control = this.form.controls[field];

        return control.invalid && control.touched;
    }

    public isFieldValid(field: keyof ResetPasswordFormControl): boolean {
        const control = this.form.controls[field];
        return control.valid && control.touched;
    }

    public isFieldTouched(field: keyof ResetPasswordFormControl): boolean {
        const control = this.form.controls[field];
        return control.touched;
    }

    public getFieldError(field: keyof ResetPasswordFormControl): string | null {
        return getControlError(
            this.form.controls[field],
            RESET_PASSWORD_FORM_ERROR_MESSAGES[field]
        );
    }
}
