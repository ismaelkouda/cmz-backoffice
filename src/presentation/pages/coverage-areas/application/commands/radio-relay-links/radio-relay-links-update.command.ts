import { RadioRelayLinksFrequency } from '@presentation/pages/coverage-areas/domain/enums/radio-relay-links/radio-relay-links-frequency.enum';
import { RadioRelayLinksOperator } from '@presentation/pages/coverage-areas/domain/enums/radio-relay-links/radio-relay-links-operator.enum';

export class RadioRelayLinksUpdateCommand {
    constructor(
        public readonly uniqId?: string,
        public readonly name?: string,
        public readonly operator?: RadioRelayLinksOperator,
        public readonly frequency?: RadioRelayLinksFrequency,
        public readonly longitudePointA?: string,
        public readonly latitudePointA?: string,
        public readonly longitudePointB?: string,
        public readonly latitudePointB?: string,
        public readonly geomFile?: File
    ) {}
}
