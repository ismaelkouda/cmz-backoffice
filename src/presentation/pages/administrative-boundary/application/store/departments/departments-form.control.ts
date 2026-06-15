import { FormControl } from '@angular/forms';

export interface DepartmentsFormControl {
    code: FormControl<string>;
    population: FormControl<number>;
    infrastructure: FormControl<number>;
    region: FormControl<string>;
    name: FormControl<string>;
    description: FormControl<string>;
}
