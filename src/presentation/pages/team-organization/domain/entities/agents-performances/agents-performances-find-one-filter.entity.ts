import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

import { AgentsPerformancesFindOneFilterVo } from '../../value-objects/agents-performances/agents-performance-find-one-filter.vo';

export class AgentsPerformancesFindOneFilterEntity {
    constructor(
        public readonly uniqId?: string,
        public readonly search?: string,
        public readonly reportType?: string,
        public readonly operators?: string[],
        public readonly period?: DatePeriod
    ) {}

    static fromVo(
        vo: AgentsPerformancesFindOneFilterVo
    ): AgentsPerformancesFindOneFilterEntity {
        return new AgentsPerformancesFindOneFilterEntity(
            vo.uniqId,
            vo.search,
            vo.reportType,
            vo.operators,
            vo.period
        );
    }

    isRestrictedByPeriod(): boolean {
        return !!this.period;
    }
}
