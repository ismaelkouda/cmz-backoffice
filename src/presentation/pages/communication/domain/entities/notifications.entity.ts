export interface Notifications {
    readonly uniqId: string;
    readonly type: string;
    readonly message: string;
    readonly createdAt: string;
}

export class NotificationsEntity implements Notifications {
    constructor(
        public readonly uniqId: string,
        public readonly type: string,
        public readonly message: string,
        public readonly createdAt: string,
    ) { }

    public clone(updates: Partial<Notifications>): NotificationsEntity {
        return new NotificationsEntity(
            updates.uniqId ?? this.uniqId,
            updates.type ?? this.type,
            updates.message ?? this.message,
            updates.createdAt ?? this.createdAt
        );
    }
}
