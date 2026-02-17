export class TasksQuery {
    constructor(
        public readonly uniqId?: string,
        public readonly initiatorPhoneNumber?: string,
        public readonly reportType?: string,
        public readonly operators?: string[],
        public readonly source?: string,
        public readonly startDate?: string,
        public readonly endDate?: string
    ) {}
}
