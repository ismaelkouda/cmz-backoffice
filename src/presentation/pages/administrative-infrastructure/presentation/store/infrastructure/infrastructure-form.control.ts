import { FormControl } from '@angular/forms';
import { Coordinates } from '@shared/domain/interfaces/coordinates.interface';
import { INFRASTRUCTURE_FORM_KEYS } from '@presentation/pages/administrative-infrastructure/presentation/constants/infrastructure/infrastructure-form-keys.constant';

export interface InfrastructureFormControl {
    [INFRASTRUCTURE_FORM_KEYS.NAME]: FormControl<string | undefined>;
    [INFRASTRUCTURE_FORM_KEYS.DESCRIPTION]: FormControl<string | undefined>;
    [INFRASTRUCTURE_FORM_KEYS.TYPE]: FormControl<string | undefined>;
    [INFRASTRUCTURE_FORM_KEYS.POSITION]: FormControl<Coordinates | undefined>;
}
