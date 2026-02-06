import { FormControl } from '@angular/forms';

export interface TeamsFilterControl {
    search: FormControl<string | undefined>;
    member: FormControl<string | undefined>;
    isActive: FormControl<boolean | undefined>;
}
