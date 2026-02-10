import { FormControl } from '@angular/forms';

export interface DepartmentsByRegionIdFilterControl {
    regionId: FormControl<string | null>;
    municipalityCode: FormControl<string | null>;
    search: FormControl<string | null>;
    isActive: FormControl<boolean | null>;
    startDate: FormControl<string | null>;
    endDate: FormControl<string | null>;
}
