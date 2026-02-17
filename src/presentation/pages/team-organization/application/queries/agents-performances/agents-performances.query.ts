export class AgentsPerformancesQuery {
    constructor(
        public readonly search?: string,
        public readonly member?: string,
        public readonly isAchieved?: string,
        public readonly startDate?: string,
        public readonly endDate?: string
    ) {}
}
