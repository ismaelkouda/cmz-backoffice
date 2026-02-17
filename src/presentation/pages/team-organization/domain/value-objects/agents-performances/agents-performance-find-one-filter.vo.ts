import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

import { AgentsPerformancesFindOneFilterDto } from '@presentation/pages/team-organization/application/dto/agents-performances/agents-performances-find-one-filter.dto';

export class AgentsPerformancesFindOneFilterVo {
    public readonly uniqId?: string;
    public readonly search?: string;
    public readonly reportType?: string;
    public readonly operators?: string[];
    public readonly period?: DatePeriod;

    private constructor(props: {
        uniqId?: string;
        search?: string;
        reportType?: string;
        operators?: string[];
        period?: DatePeriod;
    }) {
        this.uniqId = props.uniqId;
        this.search = props.search;
        this.reportType = props.reportType;
        this.operators = props.operators;
        this.period = props.period;
    }

    static fromDto(
        dto: AgentsPerformancesFindOneFilterDto | null
    ): AgentsPerformancesFindOneFilterVo {
        const uniqId = dto?.uniqId.trim();
        const search = dto?.search?.trim() || undefined;
        const reportType = dto?.reportType?.trim() || undefined;
        const operators = dto?.operators || undefined;

        let period: DatePeriod | undefined;

        if (dto?.startDate || dto?.endDate) {
            period = DatePeriod.create(dto.startDate, dto.endDate);
        }

        return new AgentsPerformancesFindOneFilterVo({
            uniqId,
            search,
            reportType,
            operators,
            period,
        });
    }
}
