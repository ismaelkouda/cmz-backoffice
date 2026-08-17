import { FormControl } from '@angular/forms';
export interface RegionsFilterControl {
    search: FormControl<string | null>;
    startDate: FormControl<string | null>;
    endDate: FormControl<string | null>;
}
