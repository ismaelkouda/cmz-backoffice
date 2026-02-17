import { FormControl } from '@angular/forms';

export interface ManagementFormControl {
    decision: FormControl<string | null>;
    comment: FormControl<string>;
    reason: FormControl<string | null>;
}
