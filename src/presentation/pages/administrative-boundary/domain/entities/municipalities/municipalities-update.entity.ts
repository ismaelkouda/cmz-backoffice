import { MunicipalitiesUpdateVo } from '@presentation/pages/administrative-boundary/domain/value-objects/municipalities/municipalities-update.vo';

export class MunicipalitiesUpdateEntity {
    constructor(
        public readonly uniqId: string,
        public readonly code: string,
        public readonly name: string,
        public readonly department: string,
        public readonly description: string
    ) {}

    static fromVo(vo: MunicipalitiesUpdateVo): MunicipalitiesUpdateEntity {
        return new MunicipalitiesUpdateEntity(
            vo.uniqId,
            vo.code,
            vo.name,
            vo.department,
            vo.description
        );
    }
}
