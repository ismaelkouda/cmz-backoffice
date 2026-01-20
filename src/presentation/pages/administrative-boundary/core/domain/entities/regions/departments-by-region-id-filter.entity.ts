export class DepartmentsByRegionIdFilterEntity {
    constructor(
        public readonly regionCode: string,
        public readonly search: string,
        public readonly isActive: boolean,
        public readonly startDate: string,
        public readonly endDate: string
    ) { }

    public clone(updates: Partial<DepartmentsByRegionIdFilterEntity>): DepartmentsByRegionIdFilterEntity {
        return new DepartmentsByRegionIdFilterEntity(
            updates.regionCode ?? this.regionCode,
            updates.search ?? this.search,
            updates.isActive ?? this.isActive,
            updates.startDate ?? this.startDate,
            updates.endDate ?? this.endDate
        );
    }
}