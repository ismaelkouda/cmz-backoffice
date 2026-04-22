import {
    DAILY_GOAL_HISTORY,
    DAILY_GOAL_LIST,
} from '@pages/team-organization/presentation/features/daily-goal/daily-goal-paths.constants';
import { DAILY_GOAL_ROUTE } from '@pages/team-organization/team-organization.routes';
import { TEAM_ORGANIZATION_ROUTE } from '@shared/routes/routes';

export const DAILY_GOAL_TABS = [
    {
        value: '0',
        route: `/${TEAM_ORGANIZATION_ROUTE}/${DAILY_GOAL_ROUTE}/${DAILY_GOAL_LIST}`,
        label: 'TEAM_ORGANIZATION.DAILY_GOAL.TABS.DAILY_GOAL.LABEL',
        icon: 'pi pi-list',
    },
    {
        value: '1',
        route: `/${TEAM_ORGANIZATION_ROUTE}/${DAILY_GOAL_ROUTE}/${DAILY_GOAL_HISTORY}`,
        label: 'TEAM_ORGANIZATION.DAILY_GOAL.TABS.HISTORY.LABEL',
        icon: 'pi pi-history',
        queryParams: { ref: 'daily-objective' },
    },
];
