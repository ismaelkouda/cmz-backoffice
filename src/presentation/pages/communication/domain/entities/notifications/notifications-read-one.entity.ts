import { NotificationsReadOneVo } from '@pages/communication/domain/value-objects/notifications/notifications-read-one.vo';

export class NotificationsReadOneEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(vo: NotificationsReadOneVo): NotificationsReadOneEntity {
        return new NotificationsReadOneEntity(vo.uniqId);
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
