import { FormControl } from '@angular/forms';

export interface ProfilesPermissionsUsersFilterControl {
    search: FormControl<string | undefined>;
    userEmail: FormControl<string | undefined>;
    phone: FormControl<string | undefined>;
}
