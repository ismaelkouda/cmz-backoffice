import { RESET_PASSWORD_FORM_KEYS } from '@presentation/pages/authentication/presentation/constants/reset-password/reset-password-form-keys.constant';

export const RESET_PASSWORD_FORM_ERROR_MESSAGES = {
    [RESET_PASSWORD_FORM_KEYS.PASSWORD]: {
        required: 'RESET_PASSWORD.FORM.PASSWORD.REQUIRED',
        minlength: 'RESET_PASSWORD.FORM.PASSWORD.MIN_LENGTH',
    },
    [RESET_PASSWORD_FORM_KEYS.CONFIRM_PASSWORD]: {
        required: 'RESET_PASSWORD.FORM.CONFIRM_PASSWORD.REQUIRED',
        minlength: 'RESET_PASSWORD.FORM.CONFIRM_PASSWORD.MIN_LENGTH',
        mismatch: 'RESET_PASSWORD.FORM.CONFIRM_PASSWORD.MISMATCH',
    },
} as const;
