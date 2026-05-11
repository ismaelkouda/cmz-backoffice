import {
    PARTICIPANTS_HISTORY,
    PARTICIPANTS_LIST,
} from '@presentation/pages/team-organization/presentation/features/participants/participants-paths.constants';
import { PARTICIPANTS_ROUTE } from '@presentation/pages/team-organization/team-organization.routes';
import { TEAM_ORGANIZATION_ROUTE } from '@shared/routes/routes';

export const PARTICIPANTS_TABS = [
    {
        value: '0',
        route: `/${TEAM_ORGANIZATION_ROUTE}/${PARTICIPANTS_ROUTE}/${PARTICIPANTS_LIST}`,
        label: 'TEAM_ORGANIZATION.PARTICIPANTS.TABS.PARTICIPANTS.LABEL',
        icon: 'pi pi-list',
    },
    {
        value: '1',
        route: `/${TEAM_ORGANIZATION_ROUTE}/${PARTICIPANTS_ROUTE}/${PARTICIPANTS_HISTORY}`,
        label: 'TEAM_ORGANIZATION.PARTICIPANTS.TABS.HISTORY.LABEL',
        icon: 'pi pi-history',
        queryParams: { ref: 'user', module: 'teams-organization' },
    },
];
