import { FormControl } from '@angular/forms';

export interface TermsUseFilterControl {
    search: FormControl<string | undefined>;
    version: FormControl<string | undefined>;
    status: FormControl<string | undefined>;
    startDate: FormControl<Date | undefined>;
    endDate: FormControl<Date | undefined>;
}
