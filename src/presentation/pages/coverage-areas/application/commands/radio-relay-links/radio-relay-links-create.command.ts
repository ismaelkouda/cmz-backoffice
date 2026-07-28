import { RadioRelayLinksFrequency } from '@presentation/pages/coverage-areas/domain/enums/radio-relay-links/radio-relay-links-frequency.enum';
import { RadioRelayLinksOperator } from '@presentation/pages/coverage-areas/domain/enums/radio-relay-links/radio-relay-links-operator.enum';

export class RadioRelayLinksCreateCommand {
    constructor(
        public readonly name: string | undefined,
        public readonly operator: RadioRelayLinksOperator | undefined,
        public readonly frequency: RadioRelayLinksFrequency | undefined,
        public readonly startDate: Date | undefined,
        public readonly endDate: Date | undefined
    ) {}
}
