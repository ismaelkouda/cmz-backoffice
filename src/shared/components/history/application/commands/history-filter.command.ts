export class HistoryFilterCommand {
    constructor(
        public readonly typeModel: string,
        public readonly module?: string,
        public readonly search?: string,
        public readonly startDate?: string,
        public readonly endDate?: string
    ) {}
}
