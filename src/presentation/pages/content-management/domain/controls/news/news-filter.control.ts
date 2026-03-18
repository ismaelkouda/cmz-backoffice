import { FormControl } from '@angular/forms';

export interface NewsFilterControl {
    search: FormControl<string | undefined>;
    status: FormControl<string | undefined>;
    startDate: FormControl<Date | undefined>;
    endDate: FormControl<Date | undefined>;
}
