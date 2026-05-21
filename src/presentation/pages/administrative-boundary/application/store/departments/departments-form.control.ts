import { FormControl } from '@angular/forms';

export interface DepartmentsFormControl {
    code: FormControl<string>;
    region: FormControl<string>;
    name: FormControl<string>;
    description: FormControl<string>;
}
