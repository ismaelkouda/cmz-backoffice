import { FormControl } from '@angular/forms';

export interface RegionsFormControl {
    code: FormControl<string>;
    population: FormControl<number>;
    infrastructure: FormControl<number>;
    name: FormControl<string>;
    description: FormControl<string>;
}
