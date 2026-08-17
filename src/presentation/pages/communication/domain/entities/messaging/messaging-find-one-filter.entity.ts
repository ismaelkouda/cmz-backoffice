import { MessagingFindOneFilterVo } from '@pages/communication/domain/value-objects/messaging/messaging-find-one-filter.vo';

export class MessagingFindOneFilterEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(vo: MessagingFindOneFilterVo): MessagingFindOneFilterEntity {
        return new MessagingFindOneFilterEntity(vo.uniqId);
    }
}
