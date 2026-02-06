import { FormControl } from '@angular/forms';

export interface UsersFormControl {
    firstName: FormControl<string>;
    lastName: FormControl<string>;
    email: FormControl<string>;
    phone: FormControl<string>;
    profile: FormControl<string>;
    responsibility: FormControl<string>;
}
