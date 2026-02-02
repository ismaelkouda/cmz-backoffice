import { DatePeriod } from '@shared/core/domain/value-object/date-period.vo';

import { AgentsPerformancesFilterDto } from '@presentation/pages/team-organization/application/dtos/agents-performances/agents-performances-filter.dto';

export class AgentsPerformancesFilterVo {
    public readonly search?: string;
    public readonly period?: DatePeriod;

    private constructor(props: { search?: string; period?: DatePeriod }) {
        this.search = props.search;
        this.period = props.period;
    }

    static fromDto(
        dto: AgentsPerformancesFilterDto | null
    ): AgentsPerformancesFilterVo {
        const search = dto?.search?.trim() || undefined;

        let period: DatePeriod | undefined;

        if (dto?.startDate || dto?.endDate) {
            period = DatePeriod.create(dto.startDate, dto.endDate);
        }

        return new AgentsPerformancesFilterVo({ search, period });
    }
}
