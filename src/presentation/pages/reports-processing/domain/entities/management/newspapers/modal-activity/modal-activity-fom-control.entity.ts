import { FormControl } from '@angular/forms';

export interface ModalActivityFormControlEntity {
    report_uniq_id: FormControl<string>;
    date: FormControl<string>;
    type: FormControl<string>;
    description: FormControl<string>;
}
