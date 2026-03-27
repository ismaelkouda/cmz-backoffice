import { FormControl } from '@angular/forms';

export interface AllFilterControl {
    uniqId: FormControl<string>;
    initiatorPhoneNumber: FormControl<string>;
    startDate: FormControl<string>;
    endDate: FormControl<string>;
    reportType: FormControl<string | null>;
    status: FormControl<string | null>;
    operators: FormControl<string[]>;
    source: FormControl<string | null>;
}
