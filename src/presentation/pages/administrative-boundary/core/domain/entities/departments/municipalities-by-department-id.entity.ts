
export class MunicipalitiesByDepartmentIdEntity {
    constructor(
        public readonly uniqId: string,
        public readonly name: string,
        public readonly code: string,
        public readonly description: string,
        public readonly region: string,
        public readonly populationSize: number,
        public readonly isActive: boolean,
        public readonly createdBy: string,
        public readonly updatedBy: string,
        public readonly createdAt: string,
        public readonly updatedAt: string
    ) { }

    public clone(updates: Partial<MunicipalitiesByDepartmentIdEntity>): MunicipalitiesByDepartmentIdEntity {
        return new MunicipalitiesByDepartmentIdEntity(
            updates.uniqId ?? this.uniqId,
            updates.name ?? this.name,
            updates.code ?? this.code,
            updates.description ?? this.description,
            updates.region ?? this.region,
            updates.populationSize ?? this.populationSize,
            updates.isActive ?? this.isActive,
            updates.createdBy ?? this.createdBy,
            updates.updatedBy ?? this.updatedBy,
            updates.createdAt ?? this.createdAt,
            updates.updatedAt ?? this.updatedAt
        );
    }
}
