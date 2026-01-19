import { DepartmentsSelectEntity } from "../departments/departments-select.entity";

export class RegionsSelectEntity {
    constructor(
        public readonly name: string,
        public readonly code: string,
        public readonly departments: DepartmentsSelectEntity[],
    ) { }

    public clone(updates: Partial<RegionsSelectEntity>): RegionsSelectEntity {
        return new RegionsSelectEntity(
            updates.name ?? this.name,
            updates.code ?? this.code,
            updates.departments ?? this.departments,
        );
    }
}
