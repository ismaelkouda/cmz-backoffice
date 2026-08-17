import { FormControl } from '@angular/forms';
import { Status } from '@pages/settings-security/domain/enums/profiles-permissions/profiles-permissions-status.enum';
export interface ProfilesPermissionsFilterControl {
    search: FormControl<string | undefined>;
    user: FormControl<string | undefined>;
    status: FormControl<Status | undefined>;
}
