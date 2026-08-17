import {
    AbstractControl,
    FormControl,
    FormGroup,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from '@angular/forms';

export interface ProfileFormValue {
    readonly id: FormControl<number>;
    readonly lastName: FormControl<string>;
    readonly firstName: FormControl<string>;
    readonly email: FormControl<string>;
    readonly phone: FormControl<string>;
}

export interface PasswordFormValue {
    readonly oldPassword: FormControl<string>;
    readonly newPassword: FormControl<string>;
    readonly confirmNewPassword: FormControl<string>;
}

export interface TwoFactorFormValue {
    readonly code: FormControl<string>;
}

export type ProfileForm = FormGroup<ProfileFormValue>;
export type PasswordForm = FormGroup<PasswordFormValue>;
export type TwoFactorForm = FormGroup<TwoFactorFormValue>;

const passwordMatchValidator: ValidatorFn = (
    control: AbstractControl
): ValidationErrors | null => {
    const newPassword = control.get('newPassword')?.value;
    const confirmation = control.get('confirmNewPassword')?.value;
    return newPassword === confirmation ? null : { notMatching: true };
};

export function createProfileForm(): ProfileForm {
    return new FormGroup<ProfileFormValue>({
        id: new FormControl(0, { nonNullable: true }),
        lastName: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required],
        }),
        firstName: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required],
        }),
        email: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required, Validators.email],
        }),
        phone: new FormControl('', {
            nonNullable: true,
            validators: [
                Validators.required,
                // Validators.pattern(/^(07|05|03)\d{8}$/),
            ],
        }),
    });
}

export function createPasswordForm(): PasswordForm {
    return new FormGroup<PasswordFormValue>(
        {
            oldPassword: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            newPassword: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required, Validators.minLength(6)],
            }),
            confirmNewPassword: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required, Validators.minLength(6)],
            }),
        },
        { validators: passwordMatchValidator }
    );
}

export function createTwoFactorForm(): TwoFactorForm {
    return new FormGroup<TwoFactorFormValue>({
        code: new FormControl('', {
            nonNullable: true,
            validators: [
                Validators.required,
                Validators.minLength(6),
                Validators.maxLength(6),
                Validators.pattern(/^\d+$/),
            ],
        }),
    });
}
