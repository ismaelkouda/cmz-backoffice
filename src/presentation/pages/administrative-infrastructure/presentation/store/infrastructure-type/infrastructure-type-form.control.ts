import { FormControl } from '@angular/forms';

export interface InfrastructureTypeFormControl {
    name: FormControl<string | undefined>;
    description: FormControl<string | undefined>;
}
