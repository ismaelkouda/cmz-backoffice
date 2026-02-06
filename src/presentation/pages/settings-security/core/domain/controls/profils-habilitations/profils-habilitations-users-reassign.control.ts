import { FormControl } from '@angular/forms';

export interface ProfilsHabilitationsUsersReassignControl {
    uniqId: FormControl<string | undefined>;
    users: FormControl<string[] | undefined>;
}
