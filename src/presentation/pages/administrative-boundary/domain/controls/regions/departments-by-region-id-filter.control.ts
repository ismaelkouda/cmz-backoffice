import { FormControl } from '@angular/forms';

export interface DepartmentsByRegionIdFilterControl {
    municipality: FormControl<string | null>;
    search: FormControl<string | null>;
    status: FormControl<string | null>;
    startDate: FormControl<string | null>;
    endDate: FormControl<string | null>;
}
