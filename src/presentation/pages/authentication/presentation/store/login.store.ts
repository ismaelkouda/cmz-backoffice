import { computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { LoginFacade } from '@presentation/pages/authentication/application/facade/login.facade';
import { LoginFormControl } from '@presentation/pages/authentication/presentation/store/login-form.control';
import { LoginFormValue } from '@presentation/pages/authentication/presentation/store/login-form.value';
import { startWith } from 'rxjs';

export class LoginStore {
    private readonly fb = inject(FormBuilder);
    private readonly facade = inject(LoginFacade);

    readonly loading = this.facade.loading;
    readonly error = this.facade.error;
    readonly session = this.facade.items;

    readonly form: FormGroup<LoginFormControl> =
        this.fb.group<LoginFormControl>({
            email: new FormControl('', {
                validators: [
                    Validators.required,
                    Validators.email,
                    Validators.minLength(6),
                ],
                nonNullable: true,
            }),
            password: new FormControl('', {
                validators: [Validators.required, Validators.minLength(6)],
                nonNullable: true,
            }),
        });

    public readonly status = toSignal(
        this.form.statusChanges.pipe(startWith(this.form.status)),
        {
            initialValue: this.form.status,
        }
    );

    public readonly isValid = computed(() => this.status() === 'VALID');

    get value(): LoginFormValue {
        const raw = this.form.getRawValue();

        return {
            email: raw.email,
            password: raw.password,
        };
    }

    submit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.facade.execute(this.value, true);
    }

    resetPassword(): void {
        this.form.controls.password.reset('');
    }

    isFieldInvalid(field: keyof LoginFormControl): boolean {
        const control = this.form.get(field);

        return !!control && control.invalid && control.touched;
    }

    isFieldTouched(field: keyof LoginFormControl): boolean {
        const control = this.form.get(field);

        return !!control && control.touched;
    }

    isFieldValid(field: keyof LoginFormControl): boolean {
        const control = this.form.get(field);

        return !!control && control.valid && control.touched;
    }

    getFieldError(field: keyof LoginFormControl): string | null {
        const control = this.form.get(field);

        if (!control?.errors || !control.touched) {
            return null;
        }

        if (control.errors['required']) {
            return field === 'email'
                ? 'AUTHENTICATION.FORM.EMAIL.REQUIRED'
                : 'AUTHENTICATION.FORM.PASSWORD.REQUIRED';
        }

        if (control.errors['email']) {
            return 'AUTHENTICATION.FORM.EMAIL.INVALID_FORMAT';
        }

        if (control.errors['minlength']) {
            return field === 'email'
                ? 'AUTHENTICATION.FORM.EMAIL.MIN_LENGTH'
                : 'AUTHENTICATION.FORM.PASSWORD.MIN_LENGTH';
        }

        return null;
    }
}
