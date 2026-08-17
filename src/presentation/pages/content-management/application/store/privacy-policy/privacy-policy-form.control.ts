import { FormControl } from '@angular/forms';

export interface PrivacyPolicyFormControl {
    version: FormControl<string>;
    content: FormControl<string>;
}
