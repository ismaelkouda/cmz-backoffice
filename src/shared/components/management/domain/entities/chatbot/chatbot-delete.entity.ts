import { ChatbotDeleteVo } from '@shared/components/management/domain/value-objects/chatbot/chatbot-delete.vo';

export class ChatbotDeleteEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(vo: ChatbotDeleteVo): ChatbotDeleteEntity {
        return new ChatbotDeleteEntity(vo.uniqId);
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
