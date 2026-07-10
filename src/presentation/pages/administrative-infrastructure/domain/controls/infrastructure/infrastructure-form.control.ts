import { FormControl } from '@angular/forms';

export interface InfrastructureFormControl {
    firstName: FormControl<string>;
    lastName: FormControl<string>;
    email: FormControl<string>;
    phone: FormControl<string>;
    profile: FormControl<string>;
    // role: FormControl<string>;
}
