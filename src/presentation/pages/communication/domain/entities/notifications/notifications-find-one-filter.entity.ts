import { NotificationsFindOneFilterVo } from '../../value-objects/notifications/notifications-find-one-filter.vo';

export class NotificationsFindOneFilterEntity {
    constructor(public readonly uniqId?: string) {}

    static fromVo(
        vo: NotificationsFindOneFilterVo
    ): NotificationsFindOneFilterEntity {
        return new NotificationsFindOneFilterEntity(vo.uniqId);
    }
}
