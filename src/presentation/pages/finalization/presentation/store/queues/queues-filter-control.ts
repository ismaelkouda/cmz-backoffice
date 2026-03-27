import { FormControl } from '@angular/forms';

export interface QueuesFilterControl {
    uniqId: FormControl<string>;
    initiatorPhoneNumber: FormControl<string>;
    startDate: FormControl<string>;
    endDate: FormControl<string>;
    reportType: FormControl<string | null>;
    operators: FormControl<string[]>;
    source: FormControl<string | null>;
}
