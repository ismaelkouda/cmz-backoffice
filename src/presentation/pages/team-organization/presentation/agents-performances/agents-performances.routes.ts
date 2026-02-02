import { Routes } from '@angular/router';

import { AgentsPerformancesListComponent } from '@presentation/pages/team-organization/presentation/agents-performances/agents-performances-list/agents-performances-list.component';

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
        ],
    },
];
