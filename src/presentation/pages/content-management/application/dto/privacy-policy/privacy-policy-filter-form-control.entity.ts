import { FormControl } from '@angular/forms';

export interface PrivacyPolicyFilterFormControlDto {
    startDate: FormControl<string>;
    endDate: FormControl<string>;
    version: FormControl<string | null>;
    search: FormControl<string>;
    isPublished: FormControl<boolean | null>;
}
