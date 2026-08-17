import { Routes } from '@angular/router';

import {
    PROFILES_PERMISSIONS_FORM,
    PROFILES_PERMISSIONS_LIST,
    PROFILES_PERMISSIONS_HISTORY,
    PROFILES_PERMISSIONS_USERS,
} from '@pages/settings-security/presentation/profiles-permissions/profiles-permissions-paths.constant';

export const PROFILES_PERMISSIONS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('@pages/settings-security/presentation/profiles-permissions/profiles-permissions-page/profiles-permissions-page.component').then(
                (m) => m.ProfilesPermissionsPageComponent
            ),
        data: {
            icon: 'SETTINGS_SECURITY.PROFILES_PERMISSIONS.TITLE',
            breadcrumb: 'SETTINGS_SECURITY.PROFILES_PERMISSIONS.TITLE',
        },
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: PROFILES_PERMISSIONS_LIST,
            },
            {
                path: PROFILES_PERMISSIONS_LIST,
                loadComponent: () =>
                    import('@pages/settings-security/presentation/profiles-permissions/profiles-permissions-list/profiles-permissions-list.component').then(
                        (m) => m.ProfilesPermissionsListComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
            {
                path: PROFILES_PERMISSIONS_HISTORY,
                loadComponent: () =>
                    import('@shared/components/history/presentation/features/history-page/history-page.component').then(
                        (m) => m.HistoryPageComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
    {
        path: `${PROFILES_PERMISSIONS_FORM}`,
        data: {
            icon: 'SETTINGS_SECURITY.PROFILES_PERMISSIONS.TITLE',
            breadcrumb: 'SETTINGS_SECURITY.PROFILES_PERMISSIONS.TITLE',
        },
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('@pages/settings-security/presentation/profiles-permissions/profiles-permissions-form/profiles-permissions-form.component').then(
                        (m) => m.ProfilesPermissionsFormComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
    {
        path: `${PROFILES_PERMISSIONS_USERS}`,
        data: {
            icon: 'SETTINGS_SECURITY.PROFILES_PERMISSIONS.USERS.TITLE',
            breadcrumb: 'SETTINGS_SECURITY.PROFILES_PERMISSIONS.USERS.TITLE',
        },
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('@pages/settings-security/presentation/profiles-permissions/profiles-permissions-users/profiles-permissions-users.component').then(
                        (m) => m.ProfilesPermissionsUsersComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
];
