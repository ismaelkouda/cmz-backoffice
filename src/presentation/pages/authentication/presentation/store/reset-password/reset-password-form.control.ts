import { FormControl } from '@angular/forms';

export interface ResetPasswordFormControl {
    password: FormControl<string>;
    confirmPassword: FormControl<string>;
}
