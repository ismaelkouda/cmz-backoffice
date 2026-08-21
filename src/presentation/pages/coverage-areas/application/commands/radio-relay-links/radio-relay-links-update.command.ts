import { RadioRelayLinksOperator } from '@presentation/pages/coverage-areas/domain/enums/radio-relay-links/radio-relay-links-operator.enum';

export class RadioRelayLinksUpdateCommand {
    constructor(
        public readonly uniqId?: string,
        public readonly name?: string,
        public readonly operator?: RadioRelayLinksOperator,
        public readonly frequency?: number,
        public readonly debit?: number,
        public readonly longitudePointA?: string,
        public readonly latitudePointA?: string,
        public readonly longitudePointB?: string,
        public readonly latitudePointB?: string,
        public readonly geomFile?: File
    ) {}
}
