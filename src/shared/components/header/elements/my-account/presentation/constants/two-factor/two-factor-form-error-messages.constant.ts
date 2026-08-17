import { TWO_FACTOR_FORM_KEYS } from './two-factor-form-keys.constant';

export const TWO_FACTOR_FORM_ERROR_MESSAGES = {
    [TWO_FACTOR_FORM_KEYS.CODE]: {
        required: 'MY_ACCOUNT.TWO_FACTOR.FORM.CODE.REQUIRED',
        pattern: 'MY_ACCOUNT.TWO_FACTOR.FORM.CODE.INVALID_FORMAT',
    },
    [TWO_FACTOR_FORM_KEYS.EMAIL]: {
        required: 'MY_ACCOUNT.TWO_FACTOR.FORM.EMAIL.REQUIRED',
        pattern: 'MY_ACCOUNT.TWO_FACTOR.FORM.EMAIL.INVALID_FORMAT',
    },
    [TWO_FACTOR_FORM_KEYS.USER_ID]: {
        required: 'MY_ACCOUNT.TWO_FACTOR.FORM.USER_ID.REQUIRED',
    },
} as const;
