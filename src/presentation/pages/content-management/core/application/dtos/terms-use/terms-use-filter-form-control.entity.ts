import { FormControl } from '@angular/forms';

export interface TermsUseFilterFormControlDto {
    createdFrom: FormControl<string>;
    createdTo: FormControl<string>;
    isPublished: FormControl<boolean | null>;
}
