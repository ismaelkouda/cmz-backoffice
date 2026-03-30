import { TEAMS_LIST } from '@presentation/pages/team-organization/presentation/features/teams/teams.routes';
import { TEAMS_ROUTE } from '@pages/team-organization/team-organization.routes';
import { TEAM_ORGANIZATION_ROUTE } from '@shared/routes/routes';

export const TEAMS_TABS = [
    {
        value: '0',
        route: `/${TEAM_ORGANIZATION_ROUTE}/${TEAMS_ROUTE}/${TEAMS_LIST}`,
        label: 'TEAM_ORGANIZATION.TEAMS.TABS.TEAMS.LABEL',
        icon: 'pi pi-list',
    },
    {
        value: '1',
        route: `/${TEAM_ORGANIZATION_ROUTE}/${TEAMS_ROUTE}/history`,
        label: 'TEAM_ORGANIZATION.TEAMS.TABS.HISTORY.LABEL',
        icon: 'pi pi-history',
        queryParams: { participant: 'test' },
    },
];
