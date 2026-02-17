import { DetailsFilterVo } from '@presentation/pages/processing/domain/value-objects/details/details-filter.vo';

export class DetailsFilterEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(vo: DetailsFilterVo): DetailsFilterEntity {
        return new DetailsFilterEntity(vo.uniqId);
    }
}
