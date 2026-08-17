import { RESET_PASSWORD_FORM_KEYS } from '@presentation/pages/authentication/presentation/constants/reset-password/reset-password-form-keys.constant';

export interface ResetPasswordFormValue {
    [RESET_PASSWORD_FORM_KEYS.PASSWORD]: string;
    [RESET_PASSWORD_FORM_KEYS.CONFIRM_PASSWORD]: string;
}
