import { FormControl } from '@angular/forms';

export interface AgentsPerformancesFindOneFilterControl {
    search: FormControl<string | undefined>;
    reportType: FormControl<string | undefined>;
    operators: FormControl<boolean | undefined>;
    startDate: FormControl<Date | undefined>;
    endDate: FormControl<Date | undefined>;
}
