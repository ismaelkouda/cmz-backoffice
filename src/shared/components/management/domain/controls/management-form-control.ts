import { FormControl } from '@angular/forms';

export interface ManagementFormControl {
    managementType: FormControl<string>;
    callbackType: FormControl<string | null>;
    decision: FormControl<string>;
    comment: FormControl<string>;
    reason: FormControl<string | null>;
}
