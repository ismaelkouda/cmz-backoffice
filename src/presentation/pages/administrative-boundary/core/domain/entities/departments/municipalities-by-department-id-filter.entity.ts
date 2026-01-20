export class MunicipalitiesByDepartmentIdFilterEntity {
    constructor(
        public readonly departmentCode: string,
        public readonly search: string,
        public readonly isActive: boolean,
        public readonly startDate: string,
        public readonly endDate: string
    ) { }

    public clone(updates: Partial<MunicipalitiesByDepartmentIdFilterEntity>): MunicipalitiesByDepartmentIdFilterEntity {
        return new MunicipalitiesByDepartmentIdFilterEntity(
            updates.departmentCode ?? this.departmentCode,
            updates.search ?? this.search,
            updates.isActive ?? this.isActive,
            updates.startDate ?? this.startDate,
            updates.endDate ?? this.endDate
        );
    }
}
