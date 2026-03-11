import { DetailsTreatVo } from '@pages/processing/domain/value-objects/details/details-treat.vo';

export class DetailsTreatEntity {
    constructor(
        public readonly uniqId: string,
        public readonly comment: string
    ) {}

    static fromVo(vo: DetailsTreatVo): DetailsTreatEntity {
        return new DetailsTreatEntity(vo.uniqId, vo.comment);
    }
}
