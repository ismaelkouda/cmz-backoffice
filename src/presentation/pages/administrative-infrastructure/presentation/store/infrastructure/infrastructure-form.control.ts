import { FormControl } from '@angular/forms';
import { Coordinates } from '@shared/domain/interfaces/coordinates.interface';

export interface InfrastructureFormControl {
    name: FormControl<string | undefined>;
    description: FormControl<string | undefined>;
    type: FormControl<string | undefined>;
    position: FormControl<Coordinates | undefined>;
}
