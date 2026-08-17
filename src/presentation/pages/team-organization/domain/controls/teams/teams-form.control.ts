import { FormControl } from '@angular/forms';

export interface TeamsFormControls {
    // code: FormControl<string>;
    name: FormControl<string>;
    description: FormControl<string>;
    reportTypes: FormControl<string[]>;
    operators: FormControl<string[]>;
    permissions: FormControl<any[]>;
}
