import { FormControl } from '@angular/forms';

export interface NewsFilterControl {
    search: FormControl<string | undefined>;
    isActive: FormControl<boolean | undefined>;
    role: FormControl<string | undefined>;
    team: FormControl<string | undefined>;
}
