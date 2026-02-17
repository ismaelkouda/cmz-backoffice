import { FormControl } from '@angular/forms';

export interface MessagingFilterControl {
    search: FormControl<string | undefined>;
    targetType?: FormControl<string | undefined>;
    /* region?: FormControl<string | undefined>;
    department?: FormControl<string | undefined>;
    municipality?: FormControl<string | undefined>;
    channels: FormControl<string[] | undefined>;
    startDate?: FormControl<string | undefined>;
    endDate?: FormControl<string | undefined>; */
}
