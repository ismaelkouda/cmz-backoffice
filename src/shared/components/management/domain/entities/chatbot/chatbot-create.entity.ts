import { ChatbotCreateVo } from '@shared/components/management/domain/value-objects/chatbot/chatbot-create.vo';

export class ChatbotCreateEntity {
    constructor(
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

    static fromVo(vo: ChatbotCreateVo): ChatbotCreateEntity {
        return new ChatbotCreateEntity(
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
