import { computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginFacade } from '@presentation/pages/authentication/application/facade/login.facade';
import { LoginFormControl } from '@presentation/pages/authentication/presentation/store/login-form.control';
import { LoginFormValue } from '@presentation/pages/authentication/presentation/store/login-form.value';
import { LOGIN_ERROR_MESSAGES } from '@presentation/pages/authentication/presentation/constants/login-form.constant';
import { getControlError } from '@presentation/pages/authentication/presentation/helpers/login-form-errors.helper';
import { startWith } from 'rxjs';

export class LoginStore {
    private readonly fb = inject(FormBuilder);
    private readonly facade = inject(LoginFacade);

    public readonly loading = this.facade.loading;
    public readonly error = this.facade.error;
    public readonly session = this.facade.items;

    public readonly form: FormGroup<LoginFormControl> =
        this.fb.nonNullable.group({
            email: [
                '',
                [
                    Validators.required,
                    Validators.email,
                    Validators.minLength(6),
                ],
            ],
            password: ['', [Validators.required, Validators.minLength(6)]],
        });

    public readonly emailControl = this.form.controls.email;
    public readonly passwordControl = this.form.controls.password;

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
        this.facade.execute(this.value, true);
    }

    public resetPassword(): void {
        this.passwordControl.reset();
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
            LOGIN_ERROR_MESSAGES[field]
        );
    }
}
