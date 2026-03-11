import { DepartmentsCreateVo } from '@pages/administrative-boundary/domain/value-objects/departments/departments-create.vo';

export class DepartmentsCreateEntity {
    constructor(
        public readonly code: string,
        public readonly name: string,
        public readonly region: string,
        public readonly description: string
    ) {}

    static fromVo(vo: DepartmentsCreateVo): DepartmentsCreateEntity {
        return new DepartmentsCreateEntity(
            vo.code,
            vo.name,
            vo.region,
            vo.description
        );
    }

    public clone(
        updates: Partial<DepartmentsCreateEntity>
    ): DepartmentsCreateEntity {
        return new DepartmentsCreateEntity(
            updates.code ?? this.code,
            updates.name ?? this.name,
            updates.region ?? this.region,
            updates.description ?? this.description
        );
    }
}
