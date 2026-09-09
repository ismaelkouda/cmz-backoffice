import { RESET_PASSWORD_FORM_KEYS } from '@presentation/pages/authentication/presentation/constants/reset-password/reset-password-form-keys.constant';

export const RESET_PASSWORD_FORM_ERROR_MESSAGES = {
    [RESET_PASSWORD_FORM_KEYS.PASSWORD]: {
        required: 'PASSWORD_RESET.FORM.PASSWORD.REQUIRED',
        minlength: 'PASSWORD_RESET.FORM.PASSWORD.MIN_LENGTH',
        weakPassword: 'PASSWORD_RESET.FORM.PASSWORD.WEAK',
        emailAsPassword: 'PASSWORD_RESET.FORM.PASSWORD.EMAIL_AS_PASSWORD',
    },
    [RESET_PASSWORD_FORM_KEYS.CONFIRM_PASSWORD]: {
        required: 'PASSWORD_RESET.FORM.CONFIRM_PASSWORD.REQUIRED',
        minlength: 'PASSWORD_RESET.FORM.CONFIRM_PASSWORD.MIN_LENGTH',
        mismatch: 'PASSWORD_RESET.FORM.CONFIRM_PASSWORD.MISMATCH',
    },
} as const;
