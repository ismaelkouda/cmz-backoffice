import { LOGIN_FORM_KEYS } from '@presentation/pages/authentication/presentation/constants/login/login-form-keys.constant';

export const LOGIN_FORM_ERROR_MESSAGES = {
    [LOGIN_FORM_KEYS.EMAIL]: {
        required: 'AUTHENTICATION.FORM.EMAIL.REQUIRED',
        email: 'AUTHENTICATION.FORM.EMAIL.INVALID_FORMAT',
    },

    [LOGIN_FORM_KEYS.PASSWORD]: {
        required: 'AUTHENTICATION.FORM.PASSWORD.REQUIRED',
        minlength: 'AUTHENTICATION.FORM.PASSWORD.MIN_LENGTH',
    },
} as const;
