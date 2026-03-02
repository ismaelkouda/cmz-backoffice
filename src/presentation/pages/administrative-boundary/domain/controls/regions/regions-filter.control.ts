import { FormControl } from '@angular/forms';

export interface RegionsFilterControl {
    search: FormControl<string | null>;
    department: FormControl<string | null>;
    municipality: FormControl<string | null>;
    status: FormControl<string | null>;
    startDate: FormControl<string | null>;
    endDate: FormControl<string | null>;
}
