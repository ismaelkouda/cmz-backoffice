import { Routes } from "@angular/router";
import { AccessLogsComponent } from "./access-logs.component";

export const ACCESS_LOGS_ROUTES: Routes = [
    {
        path: '',
        component: AccessLogsComponent,
        data: {
            icon: 'SETTINGS_SECURITY.ACCESS_LOGS.TITLE',
            breadcrumb: 'SETTINGS_SECURITY.ACCESS_LOGS.TITLE',
        },
        children: [
            {
                path: '',
                component: AccessLogsComponent,
                data: { breadcrumb: { hide: true } },
            },
        ],
    }
];