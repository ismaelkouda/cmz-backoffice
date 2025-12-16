import { FormControl } from '@angular/forms';

export interface QueuesFilterFormControlEntity {
    uniq_id: FormControl<string | null>;
    initiator_phone_number: FormControl<string | null>;
    created_from: FormControl<string | null>;
    created_to: FormControl<string | null>;
    report_type: FormControl<string | null>;
    operators: FormControl<string[] | null>;
    source: FormControl<string | null>;
}
