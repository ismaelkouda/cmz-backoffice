import { FormControl } from '@angular/forms';
import { Status } from '@presentation/pages/administrative-infrastructure/domain/enums/infrastructure-type/infrastructure-type-status.enum';

export interface InfrastructureTypeFilterControl {
    search: FormControl<string | undefined>;
    status: FormControl<Status | undefined>;
    startDate: FormControl<Date | undefined>;
    endDate: FormControl<Date | undefined>;
}
