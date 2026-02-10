import { FormControl } from '@angular/forms';

export interface AgentsPerformancesFilterControl {
    search: FormControl<string | undefined>;
    member: FormControl<string | undefined>;
    isActive: FormControl<boolean | undefined>;
    startDate: FormControl<string | undefined>;
    endDate: FormControl<string | undefined>;
}
