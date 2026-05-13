import { FormControl } from '@angular/forms';

export interface ParticipantsFormControl {
    firstName: FormControl<string>;
    lastName: FormControl<string>;
    email: FormControl<string>;
    phone: FormControl<string>;
}
