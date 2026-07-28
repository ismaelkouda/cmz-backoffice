import { FormControl } from '@angular/forms';
import { INFRASTRUCTURE_FILTER_KEYS } from '@presentation/pages/administrative-infrastructure/presentation/constants/infrastructure/infrastructure-filter-keys.constant';

export interface InfrastructureFilterControl {
    [INFRASTRUCTURE_FILTER_KEYS.SEARCH]: FormControl<string | undefined>;
    [INFRASTRUCTURE_FILTER_KEYS.TYPE]: FormControl<string | undefined>;
    [INFRASTRUCTURE_FILTER_KEYS.REGION]: FormControl<string | undefined>;
    [INFRASTRUCTURE_FILTER_KEYS.DEPARTMENT]: FormControl<string | undefined>;
    [INFRASTRUCTURE_FILTER_KEYS.MUNICIPALITY]: FormControl<string | undefined>;
    [INFRASTRUCTURE_FILTER_KEYS.POSITION]: FormControl<string | undefined>;
    [INFRASTRUCTURE_FILTER_KEYS.START_DATE]: FormControl<Date | undefined>;
    [INFRASTRUCTURE_FILTER_KEYS.END_DATE]: FormControl<Date | undefined>;
}
