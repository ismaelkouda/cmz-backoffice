import { Routes } from '@angular/router';

import {
    USERS_FORM,
    USERS_LIST,
    USERS_HISTORY,
} from '@pages/settings-security/presentation/users/users-paths.constants';

export const USERS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('@pages/settings-security/presentation/users/users-page/users-page.component').then(
                (m) => m.UsersPageComponent
            ),
        data: {
            title: 'CONTENT_MANAGEMENT.USERS.TITLE',
            breadcrumb: 'CONTENT_MANAGEMENT.USERS.TITLE',
        },
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: USERS_LIST,
            },
            {
                path: USERS_LIST,
                loadComponent: () =>
                    import('@pages/settings-security/presentation/users/users-list/users-list.component').then(
                        (m) => m.UsersListComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
            {
                path: USERS_HISTORY,
                loadComponent: () =>
                    import('@shared/components/history/presentation/features/history-page/history-page.component').then(
                        (m) => m.HistoryPageComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
    {
        path: USERS_FORM,
        loadComponent: () =>
            import('@pages/settings-security/presentation/users/users-form/users-form.component').then(
                (m) => m.UsersFormComponent
            ),
        data: {
            title: 'CONTENT_MANAGEMENT.USERS.FORM.TITLE',
            breadcrumb: 'CONTENT_MANAGEMENT.USERS.FORM.TITLE',
        },
    },
];
