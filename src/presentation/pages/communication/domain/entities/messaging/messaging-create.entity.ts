import { MessagingCreateVo } from '@presentation/pages/communication/domain/value-objects/messaging/messaging-create.vo';

export class MessagingCreateEntity {
    constructor(
        public readonly type: string,
        public readonly targetType: string,
        public readonly region: string,
        public readonly department: string,
        public readonly municipality: string,
        public readonly channels: string[],
        public readonly subject: string,
        public readonly content: string,
        public readonly message: string
    ) {}

    static fromVo(vo: MessagingCreateVo): MessagingCreateEntity {
        return new MessagingCreateEntity(
            vo.type,
            vo.targetType,
            vo.region,
            vo.department,
            vo.municipality,
            vo.channels,
            vo.subject,
            vo.content,
            vo.message
        );
    }
}
