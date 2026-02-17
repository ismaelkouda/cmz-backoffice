import { DetailsRejectVo } from '@presentation/pages/requests/domain/value-objects/details/details-reject.vo';

export class DetailsRejectEntity {
    constructor(
        public readonly uniqId: string,
        public readonly comment: string,
        public readonly reason: string
    ) {}

    static fromVo(vo: DetailsRejectVo): DetailsRejectEntity {
        return new DetailsRejectEntity(vo.uniqId, vo.comment, vo.reason);
    }
}
