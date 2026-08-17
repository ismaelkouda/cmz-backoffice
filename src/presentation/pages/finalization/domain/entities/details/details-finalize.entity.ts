import { DetailsFinalizeVo } from '@pages/finalization/domain/value-objects/details/details-finalize.vo';

export class DetailsFinalizeEntity {
    constructor(
        public readonly uniqId: string,
        public readonly comment: string
    ) {}

    static fromVo(vo: DetailsFinalizeVo): DetailsFinalizeEntity {
        return new DetailsFinalizeEntity(vo.uniqId, vo.comment);
    }
}
