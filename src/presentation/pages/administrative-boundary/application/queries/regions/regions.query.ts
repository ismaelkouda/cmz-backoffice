export class RegionsQuery {
    constructor(
        public readonly search: string | null,
        public readonly startDate: string | null,
        public readonly endDate: string | null
    ) {}
}
