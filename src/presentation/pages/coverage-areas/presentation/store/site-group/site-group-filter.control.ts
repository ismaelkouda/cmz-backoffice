import { FormControl } from '@angular/forms';
import { Status } from '@pages/coverage-areas/domain/enums/site-group/site-group-status.enum';

export interface SiteGroupFilterControl {
    search: FormControl<string | undefined>;
    status: FormControl<Status | undefined>;
    startDate: FormControl<Date | undefined>;
    endDate: FormControl<Date | undefined>;
}
