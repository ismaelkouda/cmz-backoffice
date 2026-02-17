import { DetailsFilterVo } from '@presentation/pages/finalization/domain/value-objects/details/details-filter.vo';

export class DetailsFilterEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(vo: DetailsFilterVo): DetailsFilterEntity {
        return new DetailsFilterEntity(vo.uniqId);
    }
}
