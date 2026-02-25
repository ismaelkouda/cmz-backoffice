import { FormControl } from '@angular/forms';

export interface MunicipalitiesFilterControl {
    search: FormControl<string | null>;
    region: FormControl<string | null>;
    department: FormControl<string | null>;
    status: FormControl<string | null>;
    startDate: FormControl<string | null>;
    endDate: FormControl<string | null>;
}
