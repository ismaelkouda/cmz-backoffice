import { ChatbotDisableVo } from '@shared/components/management/domain/value-objects/chatbot/chatbot-disable.vo';

export class ChatbotDisableEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(vo: ChatbotDisableVo): ChatbotDisableEntity {
        return new ChatbotDisableEntity(vo.uniqId);
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
