import { FormControl } from '@angular/forms';

export interface ApprovalFilterFormControlEntity {
    created_from: FormControl<string>;
    created_to: FormControl<string>;
    report_type: FormControl<string>;
    state: FormControl<string>;
    operator: FormControl<string>;
}
