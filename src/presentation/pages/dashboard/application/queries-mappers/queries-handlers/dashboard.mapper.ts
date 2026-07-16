import { DashboardQuery } from '@pages/dashboard/application/queries/dashboard.query';

export function dashboardQueryMapper(command: DashboardQuery) {
    return {
        period: command.period,
    };
}
