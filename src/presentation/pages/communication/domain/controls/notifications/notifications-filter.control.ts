import { FormControl } from '@angular/forms';

export interface NotificationsFilterControl {
    search: FormControl<string | undefined>;
    type: FormControl<string | undefined>;
    startDate: FormControl<string | undefined>;
    endDate: FormControl<string | undefined>;
}
