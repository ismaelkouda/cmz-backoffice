import { FormControl } from '@angular/forms';

export interface SlideFormControl {
    firstName: FormControl<string>;
    lastName: FormControl<string>;
    email: FormControl<string>;
    phone: FormControl<string>;
    role: FormControl<string>;
}
