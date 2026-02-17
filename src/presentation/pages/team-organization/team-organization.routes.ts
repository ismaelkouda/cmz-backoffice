import { Routes } from '@angular/router';

export const PARTICIPANTS_ROUTE = 'participant';
export const TEAMS_ROUTE = 'team';
export const AGENTS_PERFORMANCES_ROUTE = 'agents-performances';

export const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: PARTICIPANTS_ROUTE,
                data: {
                    breadcrumb: {
                        label: 'TEAM_ORGANIZATION.PARTICIPANTS.BREADCRUMB.LABEL',
                        icon: 'TEAM_ORGANIZATION.PARTICIPANTS.BREADCRUMB.ICON',
                    },
                },
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('./presentation/participants/participants.routes').then(
                                (m) => m.PARTICIPANTS_ROUTES
                            ),
                        data: { breadcrumb: { hide: true } },
                    },
                    {
                        path: '**',
                        redirectTo: '',
                    },
                ],
            },
            {
                path: TEAMS_ROUTE,
                data: {
                    breadcrumb: {
                        label: 'TEAM_ORGANIZATION.TEAMS.BREADCRUMB.LABEL',
                        icon: 'TEAM_ORGANIZATION.TEAMS.BREADCRUMB.ICON',
                    },
                },
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('./presentation/teams/teams.routes').then(
                                (m) => m.TEAMS_ROUTES
                            ),
                        data: { breadcrumb: { hide: true } },
                    },
                    {
                        path: '**',
                        redirectTo: '',
                    },
                ],
            },
            {
                path: AGENTS_PERFORMANCES_ROUTE,
                data: {
                    breadcrumb: {
                        label: 'TEAM_ORGANIZATION.AGENTS_PERFORMANCES.BREADCRUMB.LABEL',
                        icon: 'TEAM_ORGANIZATION.AGENTS_PERFORMANCES.BREADCRUMB.ICON',
                    },
                },
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('./presentation/agents-performances/agents-performances.routes').then(
                                (m) => m.AGENTS_PERFORMANCES_ROUTES
                            ),
                        data: { breadcrumb: { hide: true } },
                    },
                    {
                        path: '**',
                        redirectTo: '',
                    },
                ],
            },
        ],
    },
];
