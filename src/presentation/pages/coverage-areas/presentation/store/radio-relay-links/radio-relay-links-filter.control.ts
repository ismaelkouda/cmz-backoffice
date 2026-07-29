import { FormControl } from '@angular/forms';
import { RadioRelayLinksOperator } from '@pages/coverage-areas/domain/enums/radio-relay-links/radio-relay-links-operator.enum';
import { RadioRelayLinksFrequency } from '@pages/coverage-areas/domain/enums/radio-relay-links/radio-relay-links-frequency.enum';

export interface RadioRelayLinksFilterControl {
    search: FormControl<string | undefined>;
    operator: FormControl<RadioRelayLinksOperator | undefined>;
    frequency: FormControl<RadioRelayLinksFrequency | undefined>;
    startDate: FormControl<Date | undefined>;
    endDate: FormControl<Date | undefined>;
}
