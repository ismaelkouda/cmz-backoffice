import { FormControl } from '@angular/forms';

export interface ProfilsHabilitationsFilterControl {
    search: FormControl<string | undefined>;
    user: FormControl<string | undefined>;
    isActive: FormControl<boolean | undefined>;
}
