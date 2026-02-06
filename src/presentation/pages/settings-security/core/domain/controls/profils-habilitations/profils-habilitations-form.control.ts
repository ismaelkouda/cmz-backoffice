import { FormControl } from '@angular/forms';

export interface ProfilsHabilitationsFormControls {
    name: FormControl<string>;
    description: FormControl<string>;
    permissions: FormControl<string[]>;
}
