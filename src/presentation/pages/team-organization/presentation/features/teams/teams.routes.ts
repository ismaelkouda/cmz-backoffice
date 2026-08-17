import { Routes } from '@angular/router';

import {
    TEAMS_HISTORY,
    TEAMS_FORM,
    TEAMS_USERS,
    TEAMS_LIST,
} from '@presentation/pages/team-organization/presentation/features/teams/teams-paths.constant';

export const TEAMS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('@presentation/pages/team-organization/presentation/features/teams/teams-page/teams-page.component').then(
                (m) => m.TeamsPageComponent
            ),
        data: {
            icon: 'TEAM_ORGANIZATION.TEAMS.TITLE',
            breadcrumb: 'TEAM_ORGANIZATION.TEAMS.TITLE',
        },
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: TEAMS_LIST,
            },
            {
                path: TEAMS_LIST,
                loadComponent: () =>
                    import('@presentation/pages/team-organization/presentation/features/teams/teams-list/teams-list.component').then(
                        (m) => m.TeamsListComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
            {
                path: TEAMS_HISTORY,
                loadComponent: () =>
                    import('@shared/components/history/presentation/features/history-page/history-page.component').then(
                        (m) => m.HistoryPageComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
    {
        path: `${TEAMS_FORM}`,
        data: {
            icon: 'TEAM_ORGANIZATION.TEAMS.TITLE',
            breadcrumb: 'TEAM_ORGANIZATION.TEAMS.TITLE',
        },
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('@presentation/pages/team-organization/presentation/features/teams/teams-form/teams-form.component').then(
                        (m) => m.TeamsFormComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
    {
        path: `${TEAMS_USERS}`,
        data: {
            icon: 'TEAM_ORGANIZATION.TEAMS.PARTICIPANTS.TITLE',
            breadcrumb: 'TEAM_ORGANIZATION.TEAMS.PARTICIPANTS.TITLE',
        },
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('@presentation/pages/team-organization/presentation/features/teams/teams-participants/teams-participants.component').then(
                        (m) => m.TeamsParticipantsComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
];
