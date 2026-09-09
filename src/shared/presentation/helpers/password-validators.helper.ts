import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export interface PasswordRule {
    key: string;
    test: (value: string) => boolean;
}

export const PASSWORD_RULES: PasswordRule[] = [
    { key: 'LENGTH', test: (value) => value.length >= 8 },
    { key: 'UPPER', test: (value) => /[A-Z]/.test(value) },
    { key: 'LOWER', test: (value) => /[a-z]/.test(value) },
    { key: 'DIGIT', test: (value) => /\d/.test(value) },
    { key: 'SPECIAL', test: (value) => /[^A-Za-z0-9]/.test(value) },
];

export function strongPasswordValidator(
    control: AbstractControl
): ValidationErrors | null {
    const value = typeof control.value === 'string' ? control.value : '';
    if (!value) {
        return null;
    }
    const isStrong = PASSWORD_RULES.every((rule) => rule.test(value));
    return isStrong ? null : { weakPassword: true };
}

export function passwordNotEmailValidator(
    emailProvider: () => string
): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = typeof control.value === 'string' ? control.value : '';
        const email = emailProvider().trim().toLowerCase();
        if (!value || !email) {
            return null;
        }
        return value.trim().toLowerCase() === email
            ? { emailAsPassword: true }
            : null;
    };
}