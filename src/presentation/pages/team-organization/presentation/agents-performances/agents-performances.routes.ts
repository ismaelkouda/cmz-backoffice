import { Routes } from '@angular/router';

import { HistoryComponent } from '@shared/components/history/history.component';

import { AgentsPerformancesListComponent } from '@presentation/pages/team-organization/presentation/agents-performances/agents-performances-list/agents-performances-list.component';

export const AGENTS_PERFORMANCES_LIST = 'list';
export const AGENTS_PERFORMANCES_FORM = 'form';
export const AGENTS_PERFORMANCES_HISTORY = 'history';

export const AGENTS_PERFORMANCES_ROUTES: Routes = [
    {
        path: '',
        component: AgentsPerformancesListComponent,
        data: {
            icon: 'TEAM_ORGANIZATION.AGENTS_PERFORMANCES.TITLE',
            breadcrumb: 'TEAM_ORGANIZATION.AGENTS_PERFORMANCES.TITLE',
        },
        children: [
            {
                path: '',
                component: AgentsPerformancesListComponent,
                data: { breadcrumb: { hide: true } },
            },
            {
                path: AGENTS_PERFORMANCES_HISTORY,
                component: HistoryComponent,
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
];
