import { FormControl } from '@angular/forms';
import { TWO_FACTOR_FORM_KEYS } from '../../constants/two-factor/two-factor-form-keys.constant';

export interface TwoFactorFormControl {
    [TWO_FACTOR_FORM_KEYS.CODE]: FormControl<string>;
    [TWO_FACTOR_FORM_KEYS.USER_ID]: FormControl<string>;
    [TWO_FACTOR_FORM_KEYS.EMAIL]: FormControl<string>;
}
