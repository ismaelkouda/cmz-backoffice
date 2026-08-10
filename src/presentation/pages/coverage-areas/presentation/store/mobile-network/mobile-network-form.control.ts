import { FormControl } from '@angular/forms';
import { Operator } from '@pages/coverage-areas/domain/enums/mobile-network/mobile-network-operator.enum';

export interface MobileNetworkFormControl {
    siteId: FormControl<string | undefined>;
    siteName: FormControl<string | undefined>;
    siteGroupId: FormControl<string | number | undefined>;
    towerTypeId: FormControl<string | number | undefined>;
    towerHeight: FormControl<string | undefined>;
    networkTechnology: FormControl<string | undefined>;
    operator: FormControl<Operator | undefined>;
    coverageRadius: FormControl<number | undefined>;
}
