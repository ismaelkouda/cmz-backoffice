import { DailyGoalQuery } from '@pages/team-organization/application/queries/daily-goal/daily-goal.query';

export function dailyGoalQueryMapper(query: DailyGoalQuery) {
    return {
        startDate: query.startDate,
        endDate: query.endDate,
    };
}
