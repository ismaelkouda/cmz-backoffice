import { FormControl } from '@angular/forms';

export interface NotificationsFilterControl {
    search: FormControl<string>;
    startDate: FormControl<string>;
    endDate: FormControl<string>;
    type: FormControl<string | null>;
}
