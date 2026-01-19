
export class RegionsEntity {
    constructor(
        public readonly uniqId: string,
        public readonly name: string,
        public readonly code: string,
        public readonly description: string,
        public readonly populationSize: number,
        public readonly departmentsCount: number,
        public readonly municipalitiesCount: number,
        public readonly isActive: boolean,
        public readonly createdBy: string,
        public readonly updatedBy: string,
        public readonly createdAt: string,
        public readonly updatedAt: string
    ) { }

    public clone(updates: Partial<RegionsEntity>): RegionsEntity {
        return new RegionsEntity(
            updates.uniqId ?? this.uniqId,
            updates.name ?? this.name,
            updates.code ?? this.code,
            updates.description ?? this.description,
            updates.populationSize ?? this.populationSize,
            updates.departmentsCount ?? this.departmentsCount,
            updates.municipalitiesCount ?? this.municipalitiesCount,
            updates.isActive ?? this.isActive,
            updates.createdBy ?? this.createdBy,
            updates.updatedBy ?? this.updatedBy,
            updates.createdAt ?? this.createdAt,
            updates.updatedAt ?? this.updatedAt
        );
    }
}
