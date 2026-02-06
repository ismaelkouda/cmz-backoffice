import { DatePeriod } from '@shared/core/domain/value-object/date-period.vo';

import { AccessLogsFilterDto } from '@presentation/pages/settings-security/core/application/dtos/access-logs/access-logs-filter.dtos';

export class AccessLogsFilterVo {
    public readonly search?: string;
    public readonly action?: string;
    public readonly period?: DatePeriod;

    private constructor(props: {
        search?: string;
        action?: string;
        period?: DatePeriod;
    }) {
        this.search = props.search;
        this.action = props.action;
        this.period = props.period;
    }

    static fromDto(dto: AccessLogsFilterDto | null): AccessLogsFilterVo {
        const search = dto?.search?.trim() || undefined;
        const action = dto?.action;

        let period: DatePeriod | undefined;

        if (dto?.startDate || dto?.endDate) {
            period = DatePeriod.create(dto.startDate, dto.endDate);
        }

        return new AccessLogsFilterVo({ search, action, period });
    }
}
