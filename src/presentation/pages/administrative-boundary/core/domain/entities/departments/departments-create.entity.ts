export class DepartmentsCreateEntity {
    constructor(
        public readonly code: string,
        public readonly name: string,
        public readonly regionCode: string,
        public readonly description: string
    ) { }

    public clone(updates: Partial<DepartmentsCreateEntity>): DepartmentsCreateEntity {
        return new DepartmentsCreateEntity(
            updates.code ?? this.code,
            updates.name ?? this.name,
            updates.regionCode ?? this.regionCode,
            updates.description ?? this.description
        );
    }
}