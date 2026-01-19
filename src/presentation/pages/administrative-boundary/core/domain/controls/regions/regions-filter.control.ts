import { FormControl } from '@angular/forms';

export interface RegionsFilterControl {
    search: FormControl<string | null>;
    departmentCode: FormControl<string | null>;
    municipalityId: FormControl<string | null>;
    isActive: FormControl<boolean | null>;
    startDate: FormControl<string | null>;
    endDate: FormControl<string | null>;
}
