import { FormControl } from '@angular/forms';

export interface TermsUseFormControl {
    firstName: FormControl<string>;
    lastName: FormControl<string>;
    email: FormControl<string>;
    phone: FormControl<string>;
    role: FormControl<string>;
}
