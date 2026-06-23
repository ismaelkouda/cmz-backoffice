export class NotificationsQuery {
    constructor(
        public readonly search?: string,
        public readonly type?: string,
        public readonly startDate?: Date,
        public readonly endDate?: Date
    ) {}
}
