import { Routes } from '@angular/router';

import {
    AGENTS_PERFORMANCES_HISTORY,
    AGENTS_PERFORMANCES_LIST,
} from '@pages/team-organization/presentation/features/agents-performances/agents-performances-paths.constants';

export const AGENTS_PERFORMANCES_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('@pages/team-organization/presentation/features/agents-performances/agents-performances-page/agents-performances-page.component').then(
                (m) => m.AgentsPerformancesPageComponent
            ),
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
                loadComponent: () =>
                    import('@pages/team-organization/presentation/features/agents-performances/agents-performances-list/agents-performances-list.component').then(
                        (m) => m.AgentsPerformancesListComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
            {
                path: AGENTS_PERFORMANCES_HISTORY,
                loadComponent: () =>
                    import('@shared/components/history/presentation/features/history-page/history-page.component').then(
                        (m) => m.HistoryPageComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
];
