export class RegionsUpdateEntity {
    constructor(
        public readonly id: string,
        public readonly code: string,
        public readonly name: string,
        public readonly description: string
    ) { }

    public clone(updates: Partial<RegionsUpdateEntity>): RegionsUpdateEntity {
        return new RegionsUpdateEntity(
            updates.id ?? this.id,
            updates.code ?? this.code,
            updates.name ?? this.name,
            updates.description ?? this.description
        );
    }
}