import { FormControl } from '@angular/forms';

export interface MunicipalitiesFormControl {
    code: FormControl<string>;
    name: FormControl<string>;
    departmentId: FormControl<string>;
    description: FormControl<string>;
}
