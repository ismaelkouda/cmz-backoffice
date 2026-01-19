import { FormControl } from "@angular/forms";

export interface MunicipalitiesFormControl {
    code: FormControl<string>;
    name: FormControl<string>;
    departmentCode: FormControl<string>;
    description: FormControl<string>;
}