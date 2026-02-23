export class AccessLogsQuery {
    constructor(
        public readonly search?: string,
        public readonly action?: string,
        public readonly startDate?: string,
        public readonly endDate?: string
    ) {}
}
