export class MunicipalitiesCreateEntity {
    constructor(
        public readonly code: string,
        public readonly name: string,
        public readonly departmentId: string,
        public readonly description: string
    ) {}

    public clone(
        updates: Partial<MunicipalitiesCreateEntity>
    ): MunicipalitiesCreateEntity {
        return new MunicipalitiesCreateEntity(
            updates.code ?? this.code,
            updates.name ?? this.name,
            updates.departmentId ?? this.departmentId,
            updates.description ?? this.description
        );
    }
}
