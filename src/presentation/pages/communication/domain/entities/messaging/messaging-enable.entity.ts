import { MessagingEnableVo } from '@presentation/pages/communication/domain/value-objects/messaging/messaging-enable.vo';

export class MessagingEnableEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(vo: MessagingEnableVo): MessagingEnableEntity {
        return new MessagingEnableEntity(vo.uniqId);
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
