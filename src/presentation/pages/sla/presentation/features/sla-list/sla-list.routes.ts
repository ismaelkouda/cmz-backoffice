import { Routes } from '@angular/router';

import {
    SLA_BUSINESS_LIST_ROUTE,
    SLA_SYSTEM_LIST_ROUTE,
} from './sla-list-tabs.constants';

export const SLA_LIST_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./sla-list-page.component').then(
                (m) => m.SlaListPageComponent
            ),
        data: {
            title: 'SLA.SLA_LIST.TITLE',
            breadcrumb: 'SLA.SLA_LIST.TITLE',
        },
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: SLA_BUSINESS_LIST_ROUTE,
            },
            {
                path: SLA_BUSINESS_LIST_ROUTE,
                loadComponent: () =>
                    import('./sla-list.component').then(
                        (m) => m.SlaListComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
            {
                path: SLA_SYSTEM_LIST_ROUTE,
                loadComponent: () =>
                    import('./sla-system-list.component').then(
                        (m) => m.SlaSystemListComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
];
