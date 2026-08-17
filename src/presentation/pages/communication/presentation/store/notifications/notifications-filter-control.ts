import { FormControl } from '@angular/forms';

export interface NotificationsFilterControl {
    search: FormControl<string | undefined>;
    type: FormControl<string | undefined>;
    startDate: FormControl<Date | undefined>;
    endDate: FormControl<Date | undefined>;
}
