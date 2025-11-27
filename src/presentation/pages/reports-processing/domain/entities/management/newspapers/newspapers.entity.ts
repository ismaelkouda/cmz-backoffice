export interface Newspapers {
    readonly id: string;
    readonly uniqId: string;
    readonly description: string;
    readonly date: string;
    readonly type: string;
    readonly createdAt: string;
    readonly updatedAt: string;
}

export class NewspapersEntity implements Newspapers {
    constructor(
        public readonly id: string,
        public readonly uniqId: string,
        public readonly description: string,
        public readonly date: string,
        public readonly type: string,
        public readonly createdAt: string,
        public readonly updatedAt: string
    ) {}

    public clone(updates: Partial<Newspapers>): NewspapersEntity {
        return new NewspapersEntity(
            updates.id ?? this.id,
            updates.uniqId ?? this.uniqId,
            updates.description ?? this.description,
            updates.date ?? this.date,
            updates.type ?? this.type,
            updates.createdAt ?? this.createdAt,
            updates.updatedAt ?? this.updatedAt
        );
    }
}
