import * as moment from 'moment';
import { AbstractControl, ValidationErrors } from '@angular/forms';

export function dateNotInPastValidator(
    control: AbstractControl
): ValidationErrors | null {
    const value = control.value;

    if (!value) return null;

    const date = moment(value);

    if (!date.isValid()) {
        return { invalidDate: true };
    }

    if (date.isAfter(moment(), 'day')) {
        return { pastDate: true };
    }

    return null;
}
