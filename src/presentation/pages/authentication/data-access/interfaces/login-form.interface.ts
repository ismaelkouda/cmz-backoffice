import { AbstractControl } from '@angular/forms';

export interface LoginFormInterface {
    email: AbstractControl<string|null>;
    password: AbstractControl<string|null>;
}
