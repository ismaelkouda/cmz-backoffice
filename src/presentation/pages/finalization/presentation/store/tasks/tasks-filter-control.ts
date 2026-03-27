import { FormControl } from '@angular/forms';

export interface TasksFilterControl {
    uniqId: FormControl<string | null>;
    initiatorPhoneNumber: FormControl<string | null>;
    startDate: FormControl<string | null>;
    endDate: FormControl<string | null>;
    reportType: FormControl<string | null>;
    operators: FormControl<string[]>;
    source: FormControl<string | null>;
}
