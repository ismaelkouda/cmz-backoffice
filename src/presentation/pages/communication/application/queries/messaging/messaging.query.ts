export class MessagingQuery {
    constructor(
        public readonly search?: string,
        public readonly targetType?: string,
        public readonly region?: string,
        public readonly department?: string,
        public readonly municipality?: string,
        public readonly channels?: string[],
        public readonly startDate?: string,
        public readonly endDate?: string
    ) {}
}
