import { FormControl } from "@angular/forms";

export interface UsersFilterFormPayloadEntity {
    userProfile: FormControl<string>;
    status: FormControl<string>;
    matricule: FormControl<string>;
    fullName: FormControl<string>;
}
