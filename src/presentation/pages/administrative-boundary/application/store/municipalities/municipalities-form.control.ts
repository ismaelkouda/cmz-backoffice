import { FormControl } from '@angular/forms';

export interface MunicipalitiesFormControl {
    code: FormControl<string>;
    region: FormControl<string>;
    department: FormControl<string>;
    name: FormControl<string>;
    description: FormControl<string>;
}
