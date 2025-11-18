import { FormControl } from '@angular/forms';

export interface ManagementFormControlEntity {
    decision: FormControl<string>;
    reason: FormControl<string>;
    comment: FormControl<string>;
    uniqId: FormControl<string>;
}
