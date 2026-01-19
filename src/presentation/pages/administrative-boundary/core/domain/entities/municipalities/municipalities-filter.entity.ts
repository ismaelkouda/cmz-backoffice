export class MunicipalitiesFilterEntity {
    constructor(
        public readonly search: string,
        public readonly regionCode: string,
        public readonly departmentCode: string,
        public readonly isActive: boolean,
        public readonly startDate: string,
        public readonly endDate: string
    ) { }

    public clone(updates: Partial<MunicipalitiesFilterEntity>): MunicipalitiesFilterEntity {
        return new MunicipalitiesFilterEntity(
            updates.search ?? this.search,
            updates.regionCode ?? this.regionCode,
            updates.departmentCode ?? this.departmentCode,
            updates.isActive ?? this.isActive,
            updates.startDate ?? this.startDate,
            updates.endDate ?? this.endDate
        );
    }
}
