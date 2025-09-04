import { AbstractControl } from '@angular/forms';

export interface LoginPayloadInterface {
    username: AbstractControl<string>;
    password: AbstractControl<string>;
}
