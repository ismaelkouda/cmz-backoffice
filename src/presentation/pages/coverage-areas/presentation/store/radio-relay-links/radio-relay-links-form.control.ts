import { FormControl } from '@angular/forms';
import { RadioRelayLinksOperator } from '@pages/coverage-areas/domain/enums/radio-relay-links/radio-relay-links-operator.enum';
import { RadioRelayLinksFrequency } from '@pages/coverage-areas/domain/enums/radio-relay-links/radio-relay-links-frequency.enum';

export interface RadioRelayLinksFormControl {
    name: FormControl<string | undefined>;
    operator: FormControl<RadioRelayLinksOperator | undefined>;
    frequency: FormControl<RadioRelayLinksFrequency | undefined>;
}
