import { FormControl } from '@angular/forms';

export interface DepartmentsFilterControl {
    search: FormControl<string | null>;
    regionCode: FormControl<string | null>;
    municipalityCode: FormControl<string | null>;
    isActive: FormControl<boolean | null>;
    startDate: FormControl<string | null>;
    endDate: FormControl<string | null>;
}
