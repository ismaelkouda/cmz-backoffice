import { FormControl } from '@angular/forms';
import { Operator } from '@pages/coverage-areas/domain/enums/optical-fiber-network/optical-fiber-network-operator.enum';

export interface OpticalFiberNetworkFilterControl {
    search: FormControl<string | undefined>;
    operator: FormControl<Operator | undefined>;
    startDate: FormControl<Date | undefined>;
    endDate: FormControl<Date | undefined>;
}
