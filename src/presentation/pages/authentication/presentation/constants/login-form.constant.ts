export const LOGIN_ERROR_MESSAGES = {
    email: {
        required: 'AUTHENTICATION.FORM.EMAIL.REQUIRED',
        email: 'AUTHENTICATION.FORM.EMAIL.INVALID_FORMAT',
        minlength: 'AUTHENTICATION.FORM.EMAIL.MIN_LENGTH',
    },

    password: {
        required: 'AUTHENTICATION.FORM.PASSWORD.REQUIRED',
        minlength: 'AUTHENTICATION.FORM.PASSWORD.MIN_LENGTH',
    },
} as const;
