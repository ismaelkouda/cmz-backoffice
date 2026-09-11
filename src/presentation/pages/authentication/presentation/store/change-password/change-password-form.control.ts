import { FormControl } from '@angular/forms';
import { CHANGE_PASSWORD_FORM_KEYS } from '@presentation/pages/authentication/presentation/constants/change-password/change-password-form-keys.constant';

export interface ChangePasswordFormControl {
    [CHANGE_PASSWORD_FORM_KEYS.PASSWORD]: FormControl<string>;
    [CHANGE_PASSWORD_FORM_KEYS.CONFIRM_PASSWORD]: FormControl<string>;
}
