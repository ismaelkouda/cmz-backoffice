import { FormControl } from '@angular/forms';
import { Technology } from '@pages/coverage-areas/domain/enums/mobile-network/mobile-network-technology.enum';
import { Operator } from '@pages/coverage-areas/domain/enums/mobile-network/mobile-network-operator.enum';

export interface MobileNetworkFormControl {
    siteId: FormControl<string | undefined>;
    siteName: FormControl<string | undefined>;
    infrastructureType: FormControl<string | undefined>;
    towerTypeId: FormControl<string | undefined>;
    towerSize: FormControl<number | undefined>;
    technology: FormControl<Technology[]>;
    operator: FormControl<Operator | undefined>;
    radius: FormControl<number | undefined>;
}
