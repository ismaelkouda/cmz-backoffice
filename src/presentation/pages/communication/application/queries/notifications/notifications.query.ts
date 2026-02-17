export class NotificationsQuery {
    constructor(
        public readonly search?: string,
        public readonly type?: string,
        public readonly startDate?: string,
        public readonly endDate?: string
    ) {}
}
