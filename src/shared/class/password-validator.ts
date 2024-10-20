import { AbstractControl, ValidationErrors } from '@angular/forms';

export class CustomValidators {
  static password(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const hasNumber = /\d/.test(value);
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    const valid = hasNumber && hasUpperCase && hasLowerCase && hasSpecialChar;
    if (!valid) {
      return { password: true };
    }
    return null;
  }
}
