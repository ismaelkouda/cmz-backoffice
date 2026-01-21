export class AccessLogsFilterEntity {
    constructor(
        public readonly search: string,
        public readonly action: string,
        public readonly startDate: string,
        public readonly endDate: string
    ) { }

    public clone(updates: Partial<AccessLogsFilterEntity>): AccessLogsFilterEntity {
        return new AccessLogsFilterEntity(
            updates.search ?? this.search,
            updates.action ?? this.action,
            updates.startDate ?? this.startDate,
            updates.endDate ?? this.endDate
        );
    }
}