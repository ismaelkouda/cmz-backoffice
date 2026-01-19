export class MunicipalitiesCreateEntity {
    constructor(
        public readonly code: string,
        public readonly name: string,
        public readonly departmentCode: string,
        public readonly description: string
    ) { }

    public clone(updates: Partial<MunicipalitiesCreateEntity>): MunicipalitiesCreateEntity {
        return new MunicipalitiesCreateEntity(
            updates.code ?? this.code,
            updates.name ?? this.name,
            updates.departmentCode ?? this.departmentCode,
            updates.description ?? this.description
        );
    }
}