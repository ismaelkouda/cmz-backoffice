import { FormControl } from '@angular/forms';
import { RESET_PASSWORD_FORM_KEYS } from '@presentation/pages/authentication/presentation/constants/reset-password/reset-password-form-keys.constant';

export interface ResetPasswordFormControl {
    [RESET_PASSWORD_FORM_KEYS.PASSWORD]: FormControl<string>;
    [RESET_PASSWORD_FORM_KEYS.CONFIRM_PASSWORD]: FormControl<string>;
}
