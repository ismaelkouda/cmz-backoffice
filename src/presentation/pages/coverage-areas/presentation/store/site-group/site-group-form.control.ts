import { FormControl } from '@angular/forms';

export interface SiteGroupFormControl {
    code: FormControl<string | undefined>;
    name: FormControl<string | undefined>;
    description: FormControl<string | undefined>;
}
