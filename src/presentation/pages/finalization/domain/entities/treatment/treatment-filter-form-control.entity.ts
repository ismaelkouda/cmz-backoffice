import { FormControl } from '@angular/forms';

export interface TreatmentFilterFormControlEntity {
    start_date: FormControl<string>;
    end_date: FormControl<string>;
    report_type: FormControl<string>;
    state: FormControl<string>;
    operator: FormControl<string>;
}
