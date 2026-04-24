import { FormControl } from '@angular/forms';
import { Status } from '@pages/administrative-boundary/domain/enums/regions/regions-status.enum';
export interface RegionsFilterControl {
    search: FormControl<string | null>;
    department: FormControl<string | null>;
    municipality: FormControl<string | null>;
    status: FormControl<Status | null>;
    startDate: FormControl<string | null>;
    endDate: FormControl<string | null>;
}
