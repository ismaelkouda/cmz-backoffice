import { MessagingUpdateVo } from '@presentation/pages/communication/domain/value-objects/messaging/messaging-update.vo';

export class MessagingUpdateEntity {
    constructor(
        public readonly uniqId: string,
        public readonly reportId: string,
        public readonly type: string,
        public readonly targetType: string,
        public readonly region: string,
        public readonly department: string,
        public readonly municipality: string,
        public readonly channels: string[],
        public readonly subject: string,
        public readonly content: string
    ) {}
    static fromVo(vo: MessagingUpdateVo): MessagingUpdateEntity {
        return new MessagingUpdateEntity(
            vo.uniqId,
            vo.reportId,
            vo.type,
            vo.targetType,
            vo.region,
            vo.department,
            vo.municipality,
            vo.channels,
            vo.subject,
            vo.content
        );
    }
}
