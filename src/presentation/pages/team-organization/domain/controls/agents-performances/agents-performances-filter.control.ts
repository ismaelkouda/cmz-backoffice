import { FormControl } from '@angular/forms';

export interface AgentsPerformancesFilterControl {
    search: FormControl<string | null>;
    startDate: FormControl<string | null>;
    endDate: FormControl<string | null>;
}
