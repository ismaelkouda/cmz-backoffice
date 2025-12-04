import { FormControl } from '@angular/forms';

export interface ActionsFormControlEntity {
    report_uniq_id: FormControl<string>;
    date: FormControl<string>;
    type: FormControl<string>;
    description: FormControl<string>;
    report_processings_count: FormControl<boolean>;
}
