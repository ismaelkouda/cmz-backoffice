import { Routes } from '@angular/router';
import { AgentsPerformancesListComponent } from '@pages/team-organization/presentation/features/agents-performances/agents-performances-list/agents-performances-list.component';
import { AgentsPerformancesPageComponent } from '@pages/team-organization/presentation/features/agents-performances/agents-performances-page/agents-performances-page.component';
import { HistoryComponent } from '@shared/components/history/history.component';

export const AGENTS_PERFORMANCES_LIST = 'page';
export const AGENTS_PERFORMANCES_FORM = 'form';
export const AGENTS_PERFORMANCES_HISTORY = 'history';

export const AGENTS_PERFORMANCES_ROUTES: Routes = [
    {
        path: '',
        component: AgentsPerformancesPageComponent,
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
