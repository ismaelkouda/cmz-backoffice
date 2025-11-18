import { AbstractControl } from '@angular/forms';

export interface LoginFormInterface {
    email: AbstractControl<string>;
    password: AbstractControl<string>;
}
