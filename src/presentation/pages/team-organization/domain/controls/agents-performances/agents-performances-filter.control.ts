import { FormControl } from '@angular/forms';

export interface AgentsPerformancesFilterControl {
    search: FormControl<string | undefined>;
    member: FormControl<string | undefined>;
    isActive: FormControl<boolean | undefined>;
    startDate: FormControl<Date | undefined>;
    endDate: FormControl<Date | undefined>;
}
