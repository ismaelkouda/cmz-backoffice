import { FormControl } from '@angular/forms';

export interface ProfilsHabilitationsUsersFilterControl {
    search: FormControl<string | undefined>;
    userEmail: FormControl<string | undefined>;
    phone: FormControl<string | undefined>;
}
