import { RadioRelayLinksFrequency } from '@pages/coverage-areas/domain/enums/radio-relay-links/radio-relay-links-frequency.enum';

export class RadioRelayLinksQuery {
    constructor(
        public readonly search?: string,
        public readonly operator?: string,
        public readonly frequency?: RadioRelayLinksFrequency,
        public readonly startDate?: Date,
        public readonly endDate?: Date
    ) {}
}
