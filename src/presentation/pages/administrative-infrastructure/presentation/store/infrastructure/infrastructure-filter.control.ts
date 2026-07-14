import { FormControl } from '@angular/forms';

export interface InfrastructureFilterControl {
    search: FormControl<string | undefined>;
    type: FormControl<string | undefined>;
    region: FormControl<string | undefined>;
    department: FormControl<string | undefined>;
    municipality: FormControl<string | undefined>;
    position: FormControl<string | undefined>;
    startDate: FormControl<Date | undefined>;
    endDate: FormControl<Date | undefined>;
}
