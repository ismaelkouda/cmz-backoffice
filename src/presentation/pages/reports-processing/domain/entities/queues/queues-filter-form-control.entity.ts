import { FormControl } from '@angular/forms';

export interface QueuesFilterFormControlEntity {
    uniqId: FormControl<string>;
    initiatorPhoneNumber: FormControl<string>;
    startDate: FormControl<string>;
    endDate: FormControl<string>;
    reportType: FormControl<string>;
    operators: FormControl<string[]>;
    source: FormControl<string>;
}
