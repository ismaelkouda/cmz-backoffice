export class AgentsPerformancesFindOneQuery {
    constructor(
        public readonly uniqId: string,
        public readonly search?: string,
        public readonly reportType?: string,
        public readonly operators?: string[],
        public readonly startDate?: string,
        public readonly endDate?: string
    ) {}
}
