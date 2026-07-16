import { AgentsPerformancesQuery } from '@pages/team-organization/application/queries/agents-performances/agents-performances.query';

export function agentsPerformancesQueryMapper(query: AgentsPerformancesQuery) {
    return {
        search: query.search,
        member: query.member,
        isAchieved: query.isAchieved,
        startDate: query.startDate,
        endDate: query.endDate,
    };
}
