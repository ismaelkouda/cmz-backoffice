import { AccessLogsFilterVo } from '@pages/settings-security/domain/value-objects/access-logs/access-logs-filter.vo';
import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

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
}
