export class RadioRelayLinksQuery {
    constructor(
        public readonly search?: string,
        public readonly operator?: string,
        public readonly startDate?: Date,
        public readonly endDate?: Date
    ) {}
}
