import { FormControl } from '@angular/forms';
import { INFRASTRUCTURE_TYPE_FORM_KEYS } from '@presentation/pages/administrative-infrastructure/presentation/constants/infrastructure-type/infrastructure-type-form-keys.constant';

export interface InfrastructureTypeFormControl {
    [INFRASTRUCTURE_TYPE_FORM_KEYS.NAME]: FormControl<string | undefined>;
    [INFRASTRUCTURE_TYPE_FORM_KEYS.DESCRIPTION]: FormControl<
        string | undefined
    >;
    [INFRASTRUCTURE_TYPE_FORM_KEYS.TAG]: FormControl<string | undefined>;
}
