import { FormControl } from '@angular/forms';

export interface HomeFilterControl {
    search: FormControl<string | undefined>;
    platforms: FormControl<string[] | undefined>;
    status: FormControl<string | undefined>;
    startDate: FormControl<string | undefined>;
    endDate: FormControl<string | undefined>;
}
