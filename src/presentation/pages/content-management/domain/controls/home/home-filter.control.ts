import { FormControl } from '@angular/forms';

export interface HomeFilterControl {
    search: FormControl<string | undefined>;
    isActive: FormControl<boolean | undefined>;
    role: FormControl<string | undefined>;
    team: FormControl<string | undefined>;
}
