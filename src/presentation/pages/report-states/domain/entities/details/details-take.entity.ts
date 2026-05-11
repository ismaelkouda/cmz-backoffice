import { DetailsTakeVo } from '@pages/report-states/domain/value-objects/details/details-take.vo';

export class DetailsTakeEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(vo: DetailsTakeVo): DetailsTakeEntity {
        return new DetailsTakeEntity(vo.uniqId);
    }
}
