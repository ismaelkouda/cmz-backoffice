import { FormControl } from '@angular/forms';

export interface ProfilesPermissionsUsersReassignControl {
    uniqId: FormControl<string | undefined>;
    users: FormControl<string[] | undefined>;
}
