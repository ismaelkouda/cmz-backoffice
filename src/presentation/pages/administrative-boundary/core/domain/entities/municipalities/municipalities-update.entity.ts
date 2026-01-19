export class MunicipalitiesUpdateEntity {
    constructor(
        public readonly id: string,
        public readonly code: string,
        public readonly name: string,
        public readonly departmentCode: string,
        public readonly description: string
    ) { }

    public clone(updates: Partial<MunicipalitiesUpdateEntity>): MunicipalitiesUpdateEntity {
        return new MunicipalitiesUpdateEntity(
            updates.id ?? this.id,
            updates.code ?? this.code,
            updates.name ?? this.name,
            updates.departmentCode ?? this.departmentCode,
            updates.description ?? this.description
        );
    }
}