import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginFacade } from '@presentation/pages/authentication/application/services/login/login.facade';
import { LoginFormControl } from '@presentation/pages/authentication/presentation/store/login/login-form.control';
import { LoginFormValue } from '@presentation/pages/authentication/presentation/store/login/login-form.value';
import { LOGIN_FORM_ERROR_MESSAGES } from '@presentation/pages/authentication/presentation/constants/login/login-form-error-messages.constant';
import { LOGIN_FORM_KEYS } from '@presentation/pages/authentication/presentation/constants/login/login-form-keys.constant';
import { FormValidators } from '@presentation/pages/authentication/presentation/constants/form-validators.constants';
import { getControlError } from '@presentation/pages/authentication/presentation/helpers/authentication-form-errors.helper';
import { startWith } from 'rxjs';

@Injectable()
export class LoginStore {
    private readonly fb = inject(FormBuilder);
    private readonly facade = inject(LoginFacade);
    public readonly loading = this.facade.loading;
    public readonly error = this.facade.error;
    public readonly session = this.facade.items;
    public readonly VALIDATION = FormValidators;

    public readonly form: FormGroup<LoginFormControl> =
        this.fb.nonNullable.group({
            [LOGIN_FORM_KEYS.EMAIL]: [
                '',
                [
                    Validators.required,
                    Validators.pattern(FormValidators.EMAIL.PATTERN),
                ],
            ],
            [LOGIN_FORM_KEYS.PASSWORD]: ['', [Validators.required]],
        });
    private readonly status = toSignal(
        this.form.statusChanges.pipe(startWith(this.form.status)),
        { initialValue: this.form.status }
    );
    public readonly isValid = computed(() => this.status() === 'VALID');
    private get value(): LoginFormValue {
        return this.form.getRawValue();
    }
    public submit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        this.facade.execute(this.value);
    }
    public resetPassword(): void {
        this.form.controls.password.setValue('');
    }
    public isFieldInvalid(field: keyof LoginFormControl): boolean {
        const control = this.form.controls[field];
        return control.invalid && control.touched;
    }
    public isFieldValid(field: keyof LoginFormControl): boolean {
        const control = this.form.controls[field];
        return control.valid && control.touched;
    }
    public isFieldTouched(field: keyof LoginFormControl): boolean {
        const control = this.form.controls[field];
        return control.touched;
    }
    public getFieldError(field: keyof LoginFormControl): string | null {
        return getControlError(
            this.form.controls[field],
            LOGIN_FORM_ERROR_MESSAGES[field]
        );
    }
}
