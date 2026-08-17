import { FormControl } from '@angular/forms';
import { Status } from '@pages/administrative-boundary/domain/enums/departments/departments-status.enum';

export interface DepartmentsByRegionIdFilterControl {
    municipality: FormControl<string | null>;
    search: FormControl<string | null>;
    status: FormControl<Status | null>;
    startDate: FormControl<string | null>;
    endDate: FormControl<string | null>;
}
