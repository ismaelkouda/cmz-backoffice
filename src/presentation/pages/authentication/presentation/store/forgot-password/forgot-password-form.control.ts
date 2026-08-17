import { FormControl } from '@angular/forms';
import { FORGOT_PASSWORD_FORM_KEYS } from '@presentation/pages/authentication/presentation/constants/forgot-password/forgot-password-form-keys.constant';

export interface ForgotPasswordFormControl {
    [FORGOT_PASSWORD_FORM_KEYS.EMAIL]: FormControl<string>;
}
