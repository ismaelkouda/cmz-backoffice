import { FormControl } from '@angular/forms';
import { Technology } from '@pages/coverage-areas/domain/enums/mobile-network/mobile-network-technology.enum';
import { Operator } from '@pages/coverage-areas/domain/enums/mobile-network/mobile-network-operator.enum';

export interface MobileNetworkFilterControl {
    search: FormControl<string | undefined>;
    towerTypeId: FormControl<string | undefined>;
    towerSize: FormControl<number | undefined>;
    technology: FormControl<Technology | undefined>;
    operator: FormControl<Operator | undefined>;
    radius: FormControl<number | undefined>;
    startDate: FormControl<Date | undefined>;
    endDate: FormControl<Date | undefined>;
}
