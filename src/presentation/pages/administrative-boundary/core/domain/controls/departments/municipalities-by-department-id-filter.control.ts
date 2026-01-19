import { FormControl } from "@angular/forms";

export interface MunicipalitiesByDepartmentIdFilterControl {
    departmentCode: FormControl<string | null>;
    search?: FormControl<string | null>;
    isActive?: FormControl<boolean | null>;
    startDate?: FormControl<string | null>;
    endDate?: FormControl<string | null>;
}