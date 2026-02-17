import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

import { NotificationsFilterVo } from '@presentation/pages/communication/domain/value-objects/notifications/notifications-filter.vo';

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

    isToday(): boolean {
        if (!this.period) {
            return false;
        }
        const today = new Date();
        return (
            this.period.start.toDateString() === today.toDateString() &&
            this.period.end.toDateString() === today.toDateString()
        );
    }

    describe(): string {
        return JSON.stringify({
            search: this.search,
            period: this.period
                ? {
                      start: this.period.start.toISOString(),
                      end: this.period.end.toISOString(),
                  }
                : null,
        });
    }
}
