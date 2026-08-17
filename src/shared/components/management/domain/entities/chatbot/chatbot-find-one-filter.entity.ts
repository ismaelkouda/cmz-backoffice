import { ChatbotFindOneFilterVo } from '@shared/components/management/domain/value-objects/chatbot/chatbot-find-one-filter.vo';

export class ChatbotFindOneFilterEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(vo: ChatbotFindOneFilterVo): ChatbotFindOneFilterEntity {
        return new ChatbotFindOneFilterEntity(vo.uniqId);
    }
}
