import { CHANGE_PASSWORD_FORM_KEYS } from '@presentation/pages/authentication/presentation/constants/change-password/change-password-form-keys.constant';

export interface ChangePasswordFormValue {
    [CHANGE_PASSWORD_FORM_KEYS.PASSWORD]: string;
    [CHANGE_PASSWORD_FORM_KEYS.CONFIRM_PASSWORD]: string;
}
