import { Routes } from '@angular/router';

export const ACCESS_LOGS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('@pages/settings-security/presentation/access-logs/access-logs-list/access-logs-list.component').then(
                (m) => m.AccessLogsListComponent
            ),
        data: {
            icon: 'SETTINGS_SECURITY.ACCESS_LOGS.TITLE',
            breadcrumb: 'SETTINGS_SECURITY.ACCESS_LOGS.TITLE',
        },
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('@pages/settings-security/presentation/access-logs/access-logs-list/access-logs-list.component').then(
                        (m) => m.AccessLogsListComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
];
