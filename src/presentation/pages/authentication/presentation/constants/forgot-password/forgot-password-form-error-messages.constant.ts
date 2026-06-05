import { FORGOT_PASSWORD_FORM_KEYS } from '@presentation/pages/authentication/presentation/constants/forgot-password/forgot-password-form-keys.constant';

export const FORGOT_PASSWORD_FORM_ERROR_MESSAGES = {
    [FORGOT_PASSWORD_FORM_KEYS.EMAIL]: {
        required: 'FORGOT_PASSWORD.FORM.EMAIL.REQUIRED',
        email: 'FORGOT_PASSWORD.FORM.EMAIL.INVALID_FORMAT',
    },
} as const;
