import { AgentsPerformancesFilterDto } from '@pages/team-organization/application/dto/agents-performances/agents-performances-filter.dto';
import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

export class AgentsPerformancesFilterVo {
    public readonly search?: string;
    public readonly member?: string;
    public readonly isAchieved?: string;
    public readonly period?: DatePeriod;

    private constructor(props: {
        search?: string;
        member?: string;
        isAchieved?: string;
        period?: DatePeriod;
    }) {
        this.search = props.search;
        this.member = props.member;
        this.isAchieved = props.isAchieved;
        this.period = props.period;
    }

    static fromDto(
        dto: AgentsPerformancesFilterDto | null
    ): AgentsPerformancesFilterVo {
        const search = dto?.search?.trim() || undefined;
        const member = dto?.member?.trim() || undefined;
        const isAchieved = dto?.isAchieved?.trim() || undefined;

        let period: DatePeriod | undefined;

        if (dto?.startDate || dto?.endDate) {
            period = DatePeriod.create(dto.startDate, dto.endDate);
        }

        return new AgentsPerformancesFilterVo({
            search,
            member,
            isAchieved,
            period,
        });
    }
}
