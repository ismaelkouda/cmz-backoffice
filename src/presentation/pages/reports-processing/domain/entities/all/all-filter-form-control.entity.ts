import { FormControl } from '@angular/forms';

export interface AllFilterFormControlEntity {
    uniq_id: FormControl<string>;
    initiator_phone_number: FormControl<string>;
    start_date: FormControl<string>;
    end_date: FormControl<string>;
    report_type: FormControl<string>;
    operators: FormControl<string[]>;
    source: FormControl<string>;
    state: FormControl<string>;
}
