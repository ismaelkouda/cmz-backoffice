import { AgentsPerformancesFindOneQuery } from '@pages/team-organization/application/queries/agents-performances/agents-performances-find-one.query';

export function agentsPerformancesFindOneQueryMapper(
    query: AgentsPerformancesFindOneQuery
) {
    return {
        uniqId: query.uniqId,
        search: query.search,
        reportType: query.reportType,
        operators: query.operators,
        startDate: query.startDate,
        endDate: query.endDate,
    };
}
