import { PASSWORD_CHANGE_FORM_KEYS } from '../../constants/password-change/password-change-form-keys.constant';

export interface PasswordChangeFormValue {
    [PASSWORD_CHANGE_FORM_KEYS.OLD_PASSWORD]: string;
    [PASSWORD_CHANGE_FORM_KEYS.NEW_PASSWORD]: string;
    [PASSWORD_CHANGE_FORM_KEYS.CONFIRM_NEW_PASSWORD]: string;
}
