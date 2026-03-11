import { NotificationsFilterVo } from '@pages/communication/domain/value-objects/notifications/notifications-filter.vo';
import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

export class NotificationsFilterEntity {
    constructor(
        public readonly search?: string,
        public readonly type?: string,
        public readonly period?: DatePeriod
    ) {}

    static fromVo(vo: NotificationsFilterVo): NotificationsFilterEntity {
        return new NotificationsFilterEntity(vo.search, vo.type, vo.period);
    }

    isRestrictedByPeriod(): boolean {
        return !!this.period;
    }
}
