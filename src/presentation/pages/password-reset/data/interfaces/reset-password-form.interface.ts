import { AbstractControl } from '@angular/forms';

export interface ResetPasswordFormInterface {
    password: AbstractControl<string>;
    confirm_password: AbstractControl<string>;
}
