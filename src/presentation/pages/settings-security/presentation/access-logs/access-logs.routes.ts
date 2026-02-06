import { Routes } from '@angular/router';

import { AccessLogsListComponent } from '@presentation/pages/settings-security/presentation/access-logs/access-logs-list/access-logs-list.component';

export const ACCESS_LOGS_ROUTES: Routes = [
    {
        path: '',
        component: AccessLogsListComponent,
        data: {
            icon: 'SETTINGS_SECURITY.ACCESS_LOGS.TITLE',
            breadcrumb: 'SETTINGS_SECURITY.ACCESS_LOGS.TITLE',
        },
        children: [
            {
                path: '',
                component: AccessLogsListComponent,
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
];
