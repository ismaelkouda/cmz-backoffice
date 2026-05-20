import { FormControl } from '@angular/forms';

export interface HistoryFilterControl {
    search: FormControl<string>;
    startDate: FormControl<string>;
    endDate: FormControl<string>;
}
