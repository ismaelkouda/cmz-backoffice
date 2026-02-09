export class MunicipalitiesFilterEntity {
    constructor(
        public readonly search: string,
        public readonly regionId: string,
        public readonly departmentId: string,
        public readonly isActive: boolean,
        public readonly startDate: string,
        public readonly endDate: string
    ) {}

    public clone(
        updates: Partial<MunicipalitiesFilterEntity>
    ): MunicipalitiesFilterEntity {
        return new MunicipalitiesFilterEntity(
            updates.search ?? this.search,
            updates.regionId ?? this.regionId,
            updates.departmentId ?? this.departmentId,
            updates.isActive ?? this.isActive,
            updates.startDate ?? this.startDate,
            updates.endDate ?? this.endDate
        );
    }
}
