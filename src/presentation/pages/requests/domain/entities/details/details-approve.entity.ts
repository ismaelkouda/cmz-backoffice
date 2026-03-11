import { DetailsApproveVo } from '@pages/requests/domain/value-objects/details/details-approve.vo';

export class DetailsApproveEntity {
    constructor(
        public readonly uniqId: string,
        public readonly comment: string
    ) {}

    static fromVo(vo: DetailsApproveVo): DetailsApproveEntity {
        return new DetailsApproveEntity(vo.uniqId, vo.comment);
    }
}
