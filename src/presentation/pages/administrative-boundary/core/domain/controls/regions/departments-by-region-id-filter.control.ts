import { FormControl } from "@angular/forms";

export interface DepartmentsByRegionIdFilterControl {
    regionCode: FormControl<string | null>;
    municipalityId: FormControl<string | null>;
    search: FormControl<string | null>;
    isActive: FormControl<boolean | null>;
    startDate: FormControl<string | null>;
    endDate: FormControl<string | null>;
}