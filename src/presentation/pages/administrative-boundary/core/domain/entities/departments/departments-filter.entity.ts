export class DepartmentsFilterEntity {
    constructor(
        public readonly search: string,
        public readonly regionId: string,
        public readonly isActive: boolean,
        public readonly startDate: string,
        public readonly endDate: string
    ) {}

    public clone(
        updates: Partial<DepartmentsFilterEntity>
    ): DepartmentsFilterEntity {
        return new DepartmentsFilterEntity(
            updates.search ?? this.search,
            updates.regionId ?? this.regionId,
            updates.isActive ?? this.isActive,
            updates.startDate ?? this.startDate,
            updates.endDate ?? this.endDate
        );
    }
}
