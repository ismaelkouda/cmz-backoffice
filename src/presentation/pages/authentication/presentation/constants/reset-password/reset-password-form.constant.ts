export const RESET_PASSWORD_ERROR_MESSAGES = {
    password: {
        required: 'RESET_PASSWORD.FORM.PASSWORD.REQUIRED',
        minlength: 'RESET_PASSWORD.FORM.PASSWORD.MIN_LENGTH',
    },
    confirmPassword: {
        required: 'RESET_PASSWORD.FORM.CONFIRM_PASSWORD.REQUIRED',
        minlength: 'RESET_PASSWORD.FORM.CONFIRM_PASSWORD.MIN_LENGTH',
        mismatch: 'RESET_PASSWORD.FORM.CONFIRM_PASSWORD.MISMATCH',
    },
} as const;
