import { FormControl } from '@angular/forms';

export interface LegalNoticeFilterFormControlDto {
    createdFrom: FormControl<string>;
    createdTo: FormControl<string>;
    isPublished: FormControl<boolean | null>;
}
