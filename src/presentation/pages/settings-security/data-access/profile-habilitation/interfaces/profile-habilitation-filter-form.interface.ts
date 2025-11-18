import { FormControl } from '@angular/forms';

export interface ProfileHabilitationFilterFormInterface {
    profile: FormControl<string>;
    state: FormControl<string>;
    matricule: FormControl<string>;
    search: FormControl<string>;
}
