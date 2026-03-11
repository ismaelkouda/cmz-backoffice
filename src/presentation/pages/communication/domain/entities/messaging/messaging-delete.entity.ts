import { MessagingDeleteVo } from '@pages/communication/domain/value-objects/messaging/messaging-delete.vo';

export class MessagingDeleteEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(vo: MessagingDeleteVo): MessagingDeleteEntity {
        return new MessagingDeleteEntity(vo.uniqId);
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
