import { FormControl } from '@angular/forms';

export interface MunicipalitiesByDepartmentIdFilterControl {
    search?: FormControl<string | null>;
    region: FormControl<string | null>;
    department: FormControl<string | null>;
    status?: FormControl<string | null>;
    startDate?: FormControl<string | null>;
    endDate?: FormControl<string | null>;
}
