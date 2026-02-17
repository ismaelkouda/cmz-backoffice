export class HistoryFilterCommand {
    constructor(
        public readonly search?: string,
        public readonly startDate?: string,
        public readonly endDate?: string
    ) {}
}
