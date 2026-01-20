export class RegionsCreateEntity {
    constructor(
        public readonly code: string,
        public readonly name: string,
        public readonly description: string
    ) { }

    public clone(updates: Partial<RegionsCreateEntity>): RegionsCreateEntity {
        return new RegionsCreateEntity(
            updates.code ?? this.code,
            updates.name ?? this.name,
            updates.description ?? this.description
        );
    }
}