import { FormControl } from '@angular/forms';
import { Status } from '@presentation/pages/administrative-infrastructure/domain/enums/infrastructure-type/infrastructure-type-status.enum';
import { INFRASTRUCTURE_TYPE_FILTER_KEYS } from '@presentation/pages/administrative-infrastructure/presentation/constants/infrastructure-type/infrastructure-type-filter-keys.constant';

export interface InfrastructureTypeFilterControl {
    [INFRASTRUCTURE_TYPE_FILTER_KEYS.SEARCH]: FormControl<string | undefined>;
    [INFRASTRUCTURE_TYPE_FILTER_KEYS.STATUS]: FormControl<Status | undefined>;
    [INFRASTRUCTURE_TYPE_FILTER_KEYS.START_DATE]: FormControl<Date | undefined>;
    [INFRASTRUCTURE_TYPE_FILTER_KEYS.END_DATE]: FormControl<Date | undefined>;
}
