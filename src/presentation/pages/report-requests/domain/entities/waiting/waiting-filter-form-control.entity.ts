import { FormControl } from '@angular/forms';

export interface WaitingFilterFormControlEntity {
    created_from: FormControl<string>;
    created_to: FormControl<string>;
    report_type: FormControl<string>;
    operator: FormControl<string>;
}
