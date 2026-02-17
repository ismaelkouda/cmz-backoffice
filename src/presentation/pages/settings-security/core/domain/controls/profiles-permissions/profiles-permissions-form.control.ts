import { FormControl } from '@angular/forms';

export interface ProfilesPermissionsFormControls {
    name: FormControl<string>;
    description: FormControl<string>;
    permissions: FormControl<string[]>;
}
