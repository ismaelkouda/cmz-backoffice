import { MunicipalitiesFindOneFilterVo } from '@presentation/pages/administrative-boundary/domain/value-objects/municipalities/municipalities-find-one-filter.vo';

export class MunicipalitiesFindOneFilterEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(
        vo: MunicipalitiesFindOneFilterVo
    ): MunicipalitiesFindOneFilterEntity {
        return new MunicipalitiesFindOneFilterEntity(vo.uniqId);
    }
}
