import {
    AGENTS_PERFORMANCES_HISTORY,
    AGENTS_PERFORMANCES_LIST,
} from '@pages/team-organization/presentation/features/agents-performances/agents-performances-paths.constants';
import { AGENTS_PERFORMANCES_ROUTE } from '@pages/team-organization/team-organization.routes';
import { TEAM_ORGANIZATION_ROUTE } from '@shared/routes/routes';

export const AGENTS_PERFORMANCES_TABS = [
    {
        value: '0',
        route: `/${TEAM_ORGANIZATION_ROUTE}/${AGENTS_PERFORMANCES_ROUTE}/${AGENTS_PERFORMANCES_LIST}`,
        label: 'TEAM_ORGANIZATION.AGENTS_PERFORMANCES.TABS.AGENTS_PERFORMANCES.LABEL',
        icon: 'pi pi-list',
    },
    {
        value: '1',
        route: `/${TEAM_ORGANIZATION_ROUTE}/${AGENTS_PERFORMANCES_ROUTE}/${AGENTS_PERFORMANCES_HISTORY}`,
        label: 'TEAM_ORGANIZATION.AGENTS_PERFORMANCES.TABS.HISTORY.LABEL',
        icon: 'pi pi-history',
        queryParams: { ref: 'agent-performance' },
    },
];
