import { ChatbotEnableVo } from '@shared/components/management/domain/value-objects/chatbot/chatbot-enable.vo';

export class ChatbotEnableEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(vo: ChatbotEnableVo): ChatbotEnableEntity {
        return new ChatbotEnableEntity(vo.uniqId);
    }

    appliesToAdminScope(): boolean {
        return this.uniqId === 'ADMIN_ACTION';
    }

    describe(): string {
        return JSON.stringify({
            uniqId: this.uniqId,
        });
    }
}
