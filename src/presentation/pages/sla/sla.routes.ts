import { Routes } from '@angular/router';

import { SLA_LIST_ROUTE } from '@presentation/pages/sla/presentation/features/sla-list/sla-list-paths.constants';
import { SLA_THRESHOLDS_ROUTE } from '@presentation/pages/sla/presentation/features/sla-thresholds/sla-thresholds-paths.constants';

export const routes: Routes = [
    {
        path: SLA_LIST_ROUTE,
        data: {
            breadcrumb: {
                label: 'SLA.SLA_LIST.BREADCRUMB.LABEL',
                icon: 'SLA.SLA_LIST.BREADCRUMB.ICONS',
            },
        },
        children: [
            {
                path: '',
                loadChildren: () =>
                    import('@presentation/pages/sla/presentation/features/sla-list/sla-list.routes').then(
                        (m) => m.SLA_LIST_ROUTES
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
        path: SLA_THRESHOLDS_ROUTE,
        data: {
            breadcrumb: {
                label: 'SLA.THRESHOLDS.BREADCRUMB.LABEL',
                icon: 'SLA.THRESHOLDS.BREADCRUMB.ICONS',
            },
        },
        children: [
            {
                path: '',
                loadChildren: () =>
                    import('@presentation/pages/sla/presentation/features/sla-thresholds/sla-thresholds.routes').then(
                        (m) => m.SLA_THRESHOLDS_ROUTES
                    ),
                data: { breadcrumb: { hide: true } },
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
    },
];
