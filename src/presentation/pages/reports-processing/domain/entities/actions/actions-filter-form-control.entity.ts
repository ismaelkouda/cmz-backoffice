import { FormControl } from '@angular/forms';

export interface ActionsFilterFormControlEntity {
    report_uniq_id: FormControl<string>;
    type: FormControl<string>;
    date_from: FormControl<string>;
    date_to: FormControl<string>;
}
