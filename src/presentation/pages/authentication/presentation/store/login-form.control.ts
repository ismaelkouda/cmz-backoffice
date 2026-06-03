import { AbstractControl } from '@angular/forms';

export interface LoginFormControl {
    email: AbstractControl<string>;
    password: AbstractControl<string>;
}
