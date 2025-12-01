import { FormControl } from '@angular/forms';

export interface TasksFilterFormControlEntity {
    uniq_id: FormControl<string>;
    initiator_phone_number: FormControl<string>;
    created_from: FormControl<string>;
    created_to: FormControl<string>;
    report_type: FormControl<string>;
    operators: FormControl<string[]>;
    source: FormControl<string>;
}
