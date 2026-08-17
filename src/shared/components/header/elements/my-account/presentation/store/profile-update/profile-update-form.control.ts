import { FormControl } from '@angular/forms';
import { PROFILE_UPDATE_FORM_KEYS } from '../../constants/profile-update/profile-update-form-keys.constant';

export interface ProfileUpdateFormControl {
    [PROFILE_UPDATE_FORM_KEYS.FIRST_NAME]: FormControl<string>;
    [PROFILE_UPDATE_FORM_KEYS.LAST_NAME]: FormControl<string>;
    [PROFILE_UPDATE_FORM_KEYS.EMAIL]: FormControl<string>;
    [PROFILE_UPDATE_FORM_KEYS.PHONE]: FormControl<string>;
}
