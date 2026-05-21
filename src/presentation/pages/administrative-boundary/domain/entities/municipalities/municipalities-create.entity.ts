import { MunicipalitiesCreateVo } from '@pages/administrative-boundary/domain/value-objects/municipalities/municipalities-create.vo';

export class MunicipalitiesCreateEntity {
    constructor(
        public readonly code: string,
        public readonly name: string,
        public readonly region: string,
        public readonly description: string,
        public readonly department: string | null
    ) {}

    static fromVo(vo: MunicipalitiesCreateVo): MunicipalitiesCreateEntity {
        return new MunicipalitiesCreateEntity(
            vo.code,
            vo.name,
            vo.region,
            vo.description,
            vo.department
        );
    }
}
