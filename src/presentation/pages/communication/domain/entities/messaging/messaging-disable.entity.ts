import { MessagingDisableVo } from '@pages/communication/domain/value-objects/messaging/messaging-disable.vo';

export class MessagingDisableEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(vo: MessagingDisableVo): MessagingDisableEntity {
        return new MessagingDisableEntity(vo.uniqId);
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
