import { FormControl } from '@angular/forms';

export interface PrivacyPolicyFilterFormControlDto {
    createdFrom: FormControl<string>;
    createdTo: FormControl<string>;
    isPublished: FormControl<boolean | null>;
}
