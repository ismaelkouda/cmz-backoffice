import { FormControl } from '@angular/forms';

export interface DepartmentsFilterControl {
    search: FormControl<string | null>;
    region: FormControl<string | null>;
    municipality: FormControl<string | null>;
    status: FormControl<string | null>;
    startDate: FormControl<string | null>;
    endDate: FormControl<string | null>;
}
