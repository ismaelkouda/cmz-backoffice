import { AgentsPerformancesFilterVo } from '@pages/team-organization/domain/value-objects/agents-performances/agents-performances-filter.vo';
import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

export class AgentsPerformancesFilterEntity {
    constructor(
        public readonly search?: string,
        public readonly member?: string,
        public readonly isAchieved?: string,
        public readonly period?: DatePeriod
    ) {}

    static fromVo(
        vo: AgentsPerformancesFilterVo
    ): AgentsPerformancesFilterEntity {
        return new AgentsPerformancesFilterEntity(
            vo.search,
            vo.member,
            vo.isAchieved,
            vo.period
        );
    }

    isRestrictedByPeriod(): boolean {
        return !!this.period;
    }
}
