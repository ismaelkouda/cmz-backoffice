import { FormControl } from '@angular/forms';

export interface ManagementFormControl {
    managementType: FormControl<string>;
    callbackType: FormControl<string | null>;
    coordinates: FormControl<string>;
    locationName: FormControl<string>;
    reportType: FormControl<string>;
    operators: FormControl<string[]>;
    description: FormControl<string>;
    decision: FormControl<string>;
    comment: FormControl<string>;
    reason: FormControl<string | null>;
    placePhoto: FormControl<File | null>;
}
