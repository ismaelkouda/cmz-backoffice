export class DailyGoalQuery {
    constructor(
        public readonly startDate?: string,
        public readonly endDate?: string
    ) {}
}
