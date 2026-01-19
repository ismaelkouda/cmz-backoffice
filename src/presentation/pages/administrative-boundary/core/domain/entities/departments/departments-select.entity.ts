import { MunicipalitiesSelectEntity } from "../municipalities/municipalities-select.entity";

export class DepartmentsSelectEntity {
    constructor(
        public readonly name: string,
        public readonly code: string,
        public readonly municipalities: MunicipalitiesSelectEntity[],
    ) { }

    public clone(updates: Partial<DepartmentsSelectEntity>): DepartmentsSelectEntity {
        return new DepartmentsSelectEntity(
            updates.name ?? this.name,
            updates.code ?? this.code,
            updates.municipalities ?? this.municipalities,
        );
    }
}
