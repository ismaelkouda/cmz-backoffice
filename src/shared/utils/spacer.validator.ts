import { AbstractControl, ValidationErrors } from '@angular/forms';

export class FormValidator {
    static cannotContainSpace(
        control: AbstractControl
    ): ValidationErrors | null {
        if ((control.value as string)?.indexOf(' ') >= 0) {
            return { cannotContainSpace: true };
        }
        return null;
    }
    static symbolsOnly(control: AbstractControl) {
        if (!/^[^`~!@#$%\^&*()_+={}|[\]\\:';"<>?,./]*$/.test(control.value)) {
            return { symbols: true };
        }
        return null;
    }
}
