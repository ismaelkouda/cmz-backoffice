import { FormControl } from '@angular/forms';
import { Status } from '@presentation/pages/administrative-infrastructure/domain/enums/infrastructure-type/infrastructure-type-status.enum';

export interface InfrastructureTypeFilterControl {
    search: FormControl<string | undefined>;
    isActive: FormControl<Status | undefined>;
}
