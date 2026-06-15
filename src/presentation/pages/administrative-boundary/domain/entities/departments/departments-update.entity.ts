import { DepartmentsUpdateVo } from '@pages/administrative-boundary/domain/value-objects/departments/departments-update.vo';

export class DepartmentsUpdateEntity {
    constructor(
        public readonly uniqId: string,
        public readonly code: string,
        public readonly population: number,
        public readonly infrastructure: number,
        public readonly name: string,
        public readonly region: string,
        public readonly description: string
    ) {}

    static fromVo(vo: DepartmentsUpdateVo): DepartmentsUpdateEntity {
        return new DepartmentsUpdateEntity(
            vo.uniqId,
            vo.code,
            vo.population,
            vo.infrastructure,
            vo.name,
            vo.region,
            vo.description
        );
    }
}
