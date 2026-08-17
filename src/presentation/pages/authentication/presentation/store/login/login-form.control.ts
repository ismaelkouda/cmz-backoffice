import { FormControl } from '@angular/forms';
import { LOGIN_FORM_KEYS } from '@presentation/pages/authentication/presentation/constants/login/login-form-keys.constant';

export interface LoginFormControl {
    [LOGIN_FORM_KEYS.EMAIL]: FormControl<string>;
    [LOGIN_FORM_KEYS.PASSWORD]: FormControl<string>;
}
