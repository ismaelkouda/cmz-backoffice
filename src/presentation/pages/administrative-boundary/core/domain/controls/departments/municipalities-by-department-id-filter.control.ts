import { FormControl } from '@angular/forms';

export interface MunicipalitiesByDepartmentIdFilterControl {
    departmentId: FormControl<string | null>;
    search?: FormControl<string | null>;
    isActive?: FormControl<boolean | null>;
    startDate?: FormControl<string | null>;
    endDate?: FormControl<string | null>;
}
