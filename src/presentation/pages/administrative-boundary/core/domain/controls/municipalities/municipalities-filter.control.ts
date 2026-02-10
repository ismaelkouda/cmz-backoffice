import { FormControl } from '@angular/forms';

export interface MunicipalitiesFilterControl {
    search: FormControl<string | null>;
    regionId: FormControl<string | null>;
    departmentId: FormControl<string | null>;
    isActive: FormControl<boolean | null>;
    startDate: FormControl<string | null>;
    endDate: FormControl<string | null>;
}
