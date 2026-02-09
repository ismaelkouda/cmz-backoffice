export class DepartmentsUpdateEntity {
    constructor(
        public readonly id: string,
        public readonly code: string,
        public readonly name: string,
        public readonly regionId: string,
        public readonly description: string
    ) {}

    public clone(
        updates: Partial<DepartmentsUpdateEntity>
    ): DepartmentsUpdateEntity {
        return new DepartmentsUpdateEntity(
            updates.id ?? this.id,
            updates.code ?? this.code,
            updates.name ?? this.name,
            updates.regionId ?? this.regionId,
            updates.description ?? this.description
        );
    }
}
