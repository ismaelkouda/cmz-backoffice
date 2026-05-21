import { FormControl } from '@angular/forms';
export interface DepartmentsFilterControl {
    search: FormControl<string | null>;
    region: FormControl<string | null>;
    startDate: FormControl<string | null>;
    endDate: FormControl<string | null>;
}
