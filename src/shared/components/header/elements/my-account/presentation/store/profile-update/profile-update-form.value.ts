import { PROFILE_UPDATE_FORM_KEYS } from '../../constants/profile-update/profile-update-form-keys.constant';

export interface ProfileUpdateFormValue {
    [PROFILE_UPDATE_FORM_KEYS.FIRST_NAME]: string;
    [PROFILE_UPDATE_FORM_KEYS.LAST_NAME]: string;
    [PROFILE_UPDATE_FORM_KEYS.EMAIL]: string;
    [PROFILE_UPDATE_FORM_KEYS.PHONE]: string;
}
