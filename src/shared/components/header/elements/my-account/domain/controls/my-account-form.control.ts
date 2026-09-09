import {
    AbstractControl,
    FormControl,
    FormGroup,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import {
    passwordNotEmailValidator,
    strongPasswordValidator,
} from '@shared/presentation/helpers/password-validators.helper';

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
    readonly channel: FormControl<'email' | 'sms'>;
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

const newPasswordNotOldValidator: ValidatorFn = (
    control: AbstractControl
): ValidationErrors | null => {
    const oldPassword = control.parent?.get('oldPassword')?.value;
    const value = control.value;
    if (!oldPassword || !value) {
        return null;
    }
    return value === oldPassword ? { oldPasswordUsed: true } : null;
};

export function createProfileForm(): ProfileForm {
    const form = new FormGroup<ProfileFormValue>({
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
        }),
        phone: new FormControl('', {
            nonNullable: true,
            validators: [
                Validators.required,
                // Validators.pattern(/^(07|05|03)\d{8}$/),
            ],
        }),
    });
    form.controls.email.disable();
    return form;
}

export function createPasswordForm(emailProvider: () => string): PasswordForm {
    return new FormGroup<PasswordFormValue>(
        {
            oldPassword: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            newPassword: new FormControl('', {
                nonNullable: true,
                validators: [
                    Validators.required,
                    strongPasswordValidator,
                    passwordNotEmailValidator(emailProvider),
                    newPasswordNotOldValidator,
                ],
            }),
            confirmNewPassword: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
        },
        { validators: passwordMatchValidator }
    );
}

export function createTwoFactorForm(): TwoFactorForm {
    return new FormGroup<TwoFactorFormValue>({
        channel: new FormControl<'email' | 'sms'>('email', {
            nonNullable: true,
            validators: [Validators.required],
        }),
        code: new FormControl('', {
            nonNullable: true,
            validators: [
                Validators.required,
                Validators.minLength(4),
                Validators.maxLength(4),
                Validators.pattern(/^\d+$/),
            ],
        }),
    });
}
