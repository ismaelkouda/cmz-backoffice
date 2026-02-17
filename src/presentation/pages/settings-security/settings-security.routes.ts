import { Routes } from '@angular/router';

export const PROFILES_PERMISSIONS_ROUTE = 'profile-and-permissions';
export const ACCESS_LOGS_ROUTE = 'auth-logs';
export const USERS_ROUTE = 'users';

export const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: ACCESS_LOGS_ROUTE,
                data: {
                    breadcrumb: {
                        label: 'SETTINGS_SECURITY.ACCESS_LOGS.BREADCRUMB.LABEL',
                        icon: 'SETTINGS_SECURITY.ACCESS_LOGS.BREADCRUMB.ICON',
                    },
                },
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('./presentation/access-logs/access-logs.routes').then(
                                (m) => m.ACCESS_LOGS_ROUTES
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
                path: PROFILES_PERMISSIONS_ROUTE,
                data: {
                    breadcrumb: {
                        label: 'SETTINGS_SECURITY.PROFILES_PERMISSIONS.BREADCRUMB.LABEL',
                        icon: 'SETTINGS_SECURITY.PROFILES_PERMISSIONS.BREADCRUMB.ICON',
                    },
                },
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('./presentation/profiles-permissions/profiles-permissions.routes').then(
                                (m) => m.PROFILES_PERMISSIONS_ROUTES
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
                path: USERS_ROUTE,
                data: {
                    breadcrumb: {
                        label: 'SETTINGS_SECURITY.USERS.BREADCRUMB.LABEL',
                        icon: 'SETTINGS_SECURITY.USERS.BREADCRUMB.ICON',
                    },
                },
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('./presentation/users/users.routes').then(
                                (m) => m.USERS_ROUTES
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
