import { FormControl } from '@angular/forms';

export interface SlideFilterControl {
    search: FormControl<string | undefined>;
    platforms: FormControl<string[] | undefined>;
    status: FormControl<string | undefined>;
    startDate: FormControl<Date | undefined>;
    endDate: FormControl<Date | undefined>;
}
