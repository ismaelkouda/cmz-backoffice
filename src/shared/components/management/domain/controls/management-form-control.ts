import { FormControl } from '@angular/forms';
import { Coordinates } from '@shared/domain/interfaces/coordinates.interface';
import { MediaValue } from '@shared/domain/types/media.types';

export interface ManagementFormControl {
    approvalType: FormControl<string>;
    callbackType: FormControl<string | null>;
    coordinates: FormControl<Coordinates | null>;
    locationName: FormControl<string>;
    reportType: FormControl<string>;
    operators: FormControl<string[]>;
    description: FormControl<string>;
    decision: FormControl<string>;
    placeDescription: FormControl<string>;
    reason: FormControl<string | null>;
    placePhoto: FormControl<MediaValue | null>;
    comment: FormControl<string>;
}
