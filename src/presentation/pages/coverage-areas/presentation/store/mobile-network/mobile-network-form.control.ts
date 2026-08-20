import { FormControl } from '@angular/forms';

export interface MobileNetworkFormControl {
    siteId: FormControl<string | undefined>;
    siteName: FormControl<string | undefined>;
    siteGroupId: FormControl<string | number | undefined>;
    towerTypeId: FormControl<string | number | undefined>;
    towerHeight: FormControl<string | undefined>;
    networkTechnology: FormControl<string | undefined>;
    operator: FormControl<string | undefined>;
    coverageRadius: FormControl<number | undefined>;
}
