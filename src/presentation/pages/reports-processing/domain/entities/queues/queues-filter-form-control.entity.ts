import { FormControl } from '@angular/forms';

export interface QueuesFilterFormControlEntity {
    uniq_id: FormControl<string>;
    initiator_phone_number: FormControl<string>;
    created_from: FormControl<string>;
    created_to: FormControl<string>;
    report_type: FormControl<string>;
    operator: FormControl<string[]>;
    source: FormControl<string>;
}
