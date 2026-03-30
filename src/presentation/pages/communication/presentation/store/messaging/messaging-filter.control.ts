import { FormControl } from '@angular/forms';

export interface MessagingFilterControl {
    search: FormControl<string>;
    // reportId: FormControl<string | null>;
    targetType?: FormControl<string | null>;
    // region?: FormControl<string>;
    // department?: FormControl<string>;
    // municipality?: FormControl<string>;
    channels: FormControl<string[]>;
    // startDate?: FormControl<string>;
    // endDate?: FormControl<string>;
}
