import { CHANGE_PASSWORD_FORM_KEYS } from '@presentation/pages/authentication/presentation/constants/change-password/change-password-form-keys.constant';

export const CHANGE_PASSWORD_FORM_ERROR_MESSAGES = {
    [CHANGE_PASSWORD_FORM_KEYS.PASSWORD]: {
        required: 'CHANGE_PASSWORD.FORM.PASSWORD.REQUIRED',
        minlength: 'CHANGE_PASSWORD.FORM.PASSWORD.MIN_LENGTH',
        weakPassword: 'CHANGE_PASSWORD.FORM.PASSWORD.WEAK',
        emailAsPassword: 'CHANGE_PASSWORD.FORM.PASSWORD.EMAIL_AS_PASSWORD',
    },
    [CHANGE_PASSWORD_FORM_KEYS.CONFIRM_PASSWORD]: {
        required: 'CHANGE_PASSWORD.FORM.CONFIRM_PASSWORD.REQUIRED',
        minlength: 'CHANGE_PASSWORD.FORM.CONFIRM_PASSWORD.MIN_LENGTH',
        mismatch: 'CHANGE_PASSWORD.FORM.CONFIRM_PASSWORD.MISMATCH',
    },
} as const;
