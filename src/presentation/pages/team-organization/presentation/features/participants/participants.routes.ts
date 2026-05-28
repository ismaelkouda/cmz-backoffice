import { Routes } from '@angular/router';

import {
    PARTICIPANTS_FORM,
    PARTICIPANTS_HISTORY,
    PARTICIPANTS_LIST,
} from '@presentation/pages/team-organization/presentation/features/participants/participants-paths.constants';

export const PARTICIPANTS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('@presentation/pages/team-organization/presentation/features/participants/participants-page/participants-page.component').then(
                (m) => m.ParticipantsPageComponent
            ),
        data: {
            title: 'TEAM_ORGANIZATION.PARTICIPANTS.TITLE',
            breadcrumb: 'TEAM_ORGANIZATION.PARTICIPANTS.TITLE',
        },
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: PARTICIPANTS_LIST,
            },
            {
                path: PARTICIPANTS_LIST,
                loadComponent: () =>
                    import('@presentation/pages/team-organization/presentation/features/participants/participants-list/participants-list.component').then(
                        (m) => m.ParticipantsListComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
            {
                path: PARTICIPANTS_HISTORY,
                loadComponent: () =>
                    import('@shared/components/history/presentation/features/history-page/history-page.component').then(
                        (m) => m.HistoryPageComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
    {
        path: `${PARTICIPANTS_FORM}`,
        data: {
            title: 'TEAM_ORGANIZATION.PARTICIPANTS.FORM.TITLE',
            breadcrumb: 'TEAM_ORGANIZATION.PARTICIPANTS.FORM.TITLE',
        },
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('@presentation/pages/team-organization/presentation/features/participants/participants-form/participants-form.component').then(
                        (m) => m.ParticipantsFormComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
];
