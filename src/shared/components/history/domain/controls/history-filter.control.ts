import { FormControl } from '@angular/forms';

export interface HistoryFilterControl {
    search: FormControl<string | null>;
    startDate: FormControl<Date | null>;
    endDate: FormControl<Date | null>;
}
