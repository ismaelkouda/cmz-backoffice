export class AllQuery {
    constructor(
        public readonly initiatorPhoneNumber?: string,
        public readonly uniqId?: string,
        public readonly reportType?: string,
        public readonly operators?: string[],
        public readonly source?: string,
        public readonly state?: string,
        public readonly startDate?: string,
        public readonly endDate?: string
    ) {}
}
