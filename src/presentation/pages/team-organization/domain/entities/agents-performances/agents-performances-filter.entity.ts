import { DatePeriod } from '@shared/core/domain/value-object/date-period.vo';

import { AgentsPerformancesFilterVo } from '@presentation/pages/team-organization/domain/value-objects/agents-performances/agents-performances-filter.vo';

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
