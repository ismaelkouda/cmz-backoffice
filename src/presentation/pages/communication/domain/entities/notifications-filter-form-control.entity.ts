import { FormControl } from '@angular/forms';

export interface NotificationsFilterFormControlEntity {
    uniq_id: FormControl<string | null>;
    initiator_phone_number: FormControl<string | null>;
    start_date: FormControl<string | null>;
    end_date: FormControl<string | null>;
    report_type: FormControl<string | null>;
    operators: FormControl<string[] | null>;
    source: FormControl<string | null>;
}
