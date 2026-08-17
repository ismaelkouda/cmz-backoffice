import { FormControl } from '@angular/forms';

export interface LegalNoticeFormControl {
    version: FormControl<string>;
    content: FormControl<string>;
}
