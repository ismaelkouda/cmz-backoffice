import { LOGIN_FORM_KEYS } from '@presentation/pages/authentication/presentation/constants/login/login-form-keys.constant';

export interface LoginFormValue {
    [LOGIN_FORM_KEYS.EMAIL]: string;
    [LOGIN_FORM_KEYS.PASSWORD]: string;
}
