import { MunicipalitiesCreateVo } from '@pages/administrative-boundary/domain/value-objects/municipalities/municipalities-create.vo';

export class MunicipalitiesCreateEntity {
    constructor(
        public readonly code: string,
        public readonly name: string,
        public readonly department: string,
        public readonly description: string
    ) {}

    static fromVo(vo: MunicipalitiesCreateVo): MunicipalitiesCreateEntity {
        return new MunicipalitiesCreateEntity(
            vo.code,
            vo.name,
            vo.department,
            vo.description
        );
    }
}
