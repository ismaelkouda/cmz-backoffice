import { Routes } from '@angular/router';

export const PROFILE_HABILITATION_ROUTE = 'permission-profiles';
export const USER_ROUTE = 'users';
export const ACCESS_LOGS_ROUTE = 'auth-logs';
export const USER_FORM_ROUTE = 'form';
export const PROFILE_FORM_ROUTE = 'form';
export const PROFILE_USERS_ROUTE = 'users';
export const PROFILE_USERS_ASSIGN_ROUTE = 'assign';

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
                            import(
                                './presentation/access-logs/access-logs.routes'
                            ).then((m) => m.ACCESS_LOGS_ROUTES),
                        data: { breadcrumb: { hide: true } },
                    },
                    {
                        path: '**',
                        redirectTo: '',
                    },
                ],
            }
        ]
    }
];

