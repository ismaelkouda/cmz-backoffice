import { Routes } from '@angular/router';
import { AgentsPerformancesListComponent } from '@pages/team-organization/presentation/features/agents-performances/agents-performances-list/agents-performances-list.component';
import { AgentsPerformancesPageComponent } from '@pages/team-organization/presentation/features/agents-performances/agents-performances-page/agents-performances-page.component';
import {
    AGENTS_PERFORMANCES_HISTORY,
    AGENTS_PERFORMANCES_LIST,
} from '@pages/team-organization/presentation/features/agents-performances/agents-performances-paths.constants';
import { HistoryPageComponent } from '@shared/components/history/presentation/features/history-page/history-page.component';

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
                pathMatch: 'full',
                redirectTo: AGENTS_PERFORMANCES_LIST,
            },
            {
                path: AGENTS_PERFORMANCES_LIST,
                component: AgentsPerformancesListComponent,
                data: { breadcrumb: { hide: true } },
            },
            {
                path: AGENTS_PERFORMANCES_HISTORY,
                component: HistoryPageComponent,
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
];
