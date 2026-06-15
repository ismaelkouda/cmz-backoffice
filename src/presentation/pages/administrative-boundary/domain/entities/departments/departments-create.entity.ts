import { DepartmentsCreateVo } from '@pages/administrative-boundary/domain/value-objects/departments/departments-create.vo';

export class DepartmentsCreateEntity {
    constructor(
        public readonly code: string,
        public readonly population: number,
        public readonly infrastructure: number,
        public readonly name: string,
        public readonly region: string,
        public readonly description: string
    ) {}

    static fromVo(vo: DepartmentsCreateVo): DepartmentsCreateEntity {
        return new DepartmentsCreateEntity(
            vo.code,
            vo.population,
            vo.infrastructure,
            vo.name,
            vo.region,
            vo.description
        );
    }
}
