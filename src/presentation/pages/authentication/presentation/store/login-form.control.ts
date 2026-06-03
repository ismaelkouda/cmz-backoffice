import { FormControl } from '@angular/forms';

export interface LoginFormControl {
    email: FormControl<string>;
    password: FormControl<string>;
}
