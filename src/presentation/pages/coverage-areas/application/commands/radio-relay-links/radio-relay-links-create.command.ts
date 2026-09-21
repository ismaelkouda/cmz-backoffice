import { RadioRelayLinksOperator } from '@presentation/pages/coverage-areas/domain/enums/radio-relay-links/radio-relay-links-operator.enum';

export class RadioRelayLinksCreateCommand {
    constructor(
        public readonly name: string | undefined,
        public readonly operator: RadioRelayLinksOperator | undefined,
        public readonly frequency: number | undefined,
        public readonly debit: number | undefined,
        public readonly longitudePointA: string | undefined,
        public readonly latitudePointA: string | undefined,
        public readonly longitudePointB: string | undefined,
        public readonly latitudePointB: string | undefined,
        public readonly geomFile: File | undefined
    ) {}
}
