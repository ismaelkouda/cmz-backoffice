import { MunicipalitiesUpdateVo } from '@pages/administrative-boundary/domain/value-objects/municipalities/municipalities-update.vo';

export class MunicipalitiesUpdateEntity {
    constructor(
        public readonly uniqId: string,
        public readonly code: string,
        public readonly name: string,
        public readonly region: string,
        public readonly description: string,
        public readonly department: string | null
    ) {}

    static fromVo(vo: MunicipalitiesUpdateVo): MunicipalitiesUpdateEntity {
        return new MunicipalitiesUpdateEntity(
            vo.uniqId,
            vo.code,
            vo.name,
            vo.region,
            vo.description,
            vo.department
        );
    }
}
