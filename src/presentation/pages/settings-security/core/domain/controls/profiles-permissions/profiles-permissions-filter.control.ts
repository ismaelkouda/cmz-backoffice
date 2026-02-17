import { FormControl } from '@angular/forms';

export interface ProfilesPermissionsFilterControl {
    search: FormControl<string | undefined>;
    user: FormControl<string | undefined>;
    isActive: FormControl<string | undefined>;
}
