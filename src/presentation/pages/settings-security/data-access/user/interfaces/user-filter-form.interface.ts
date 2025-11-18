import { FormControl } from '@angular/forms';

export interface UserFilterFormInterface {
    user_profile: FormControl<string>;
    state: FormControl<string>;
    matricule: FormControl<string>;
    search: FormControl<string>; // pour recherche par nom et prénoms
}
