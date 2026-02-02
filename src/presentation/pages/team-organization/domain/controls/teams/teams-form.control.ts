import { FormControl } from '@angular/forms';

export interface TeamsFormControls {
    code: FormControl<string>;
    name: FormControl<string>;
    description: FormControl<string>;
}
