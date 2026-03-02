import { RegionsFindOneFilterVo } from '@presentation/pages/administrative-boundary/domain/value-objects/regions/regions-find-one-filter.vo';

export class RegionsFindOneFilterEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(vo: RegionsFindOneFilterVo): RegionsFindOneFilterEntity {
        return new RegionsFindOneFilterEntity(vo.uniqId);
    }
}
