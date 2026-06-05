import { TWO_FACTOR_FORM_KEYS } from '../../constants/two-factor/two-factor-form-keys.constant';

export interface TwoFactorFormValue {
    [TWO_FACTOR_FORM_KEYS.CODE]: string;
    [TWO_FACTOR_FORM_KEYS.USER_ID]: string;
    [TWO_FACTOR_FORM_KEYS.EMAIL]: string;
}
