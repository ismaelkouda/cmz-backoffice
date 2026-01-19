import { FormControl } from "@angular/forms";

export interface DepartmentsFormControls {
    code: FormControl<string>;
    name: FormControl<string>;
    regionCode: FormControl<string>;
    description: FormControl<string>;
}
