import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

import { AccessLogsFilterVo } from '@presentation/pages/settings-security/core/domain/value-objects/access-logs/access-logs-filter.vo';

export class AccessLogsFilterEntity {
    constructor(
        public readonly search?: string,
        public readonly action?: string,
        public readonly period?: DatePeriod
    ) {}

    static fromVo(vo: AccessLogsFilterVo): AccessLogsFilterEntity {
        return new AccessLogsFilterEntity(vo.search, vo.action, vo.period);
    }

    appliesToAdminScope(): boolean {
        return this.action === 'ADMIN_ACTION';
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
            action: this.action,
            period: this.period
                ? {
                      start: this.period.start.toISOString(),
                      end: this.period.end.toISOString(),
                  }
                : null,
        });
    }
}
