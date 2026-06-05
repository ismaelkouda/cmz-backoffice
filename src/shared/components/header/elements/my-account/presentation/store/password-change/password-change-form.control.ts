import { FormControl } from '@angular/forms';
import { PASSWORD_CHANGE_FORM_KEYS } from '../../constants/password-change/password-change-form-keys.constant';

export interface PasswordChangeFormControl {
    [PASSWORD_CHANGE_FORM_KEYS.OLD_PASSWORD]: FormControl<string>;
    [PASSWORD_CHANGE_FORM_KEYS.NEW_PASSWORD]: FormControl<string>;
    [PASSWORD_CHANGE_FORM_KEYS.CONFIRM_NEW_PASSWORD]: FormControl<string>;
}
