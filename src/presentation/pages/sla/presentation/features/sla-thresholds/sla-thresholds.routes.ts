import { Routes } from '@angular/router';

import {
    SLA_BUSINESS_ROUTE,
    SLA_SYSTEM_ROUTE,
} from './sla-thresholds-tabs.constants';
import { SLA_CHANNELS_ROUTE } from './sla-thresholds-paths.constants';

export const SLA_THRESHOLDS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./sla-thresholds-page.component').then(
                (m) => m.SlaThresholdsPageComponent
            ),
        data: {
            title: 'SLA.THRESHOLDS.TITLE',
            breadcrumb: 'SLA.THRESHOLDS.TITLE',
        },
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: SLA_BUSINESS_ROUTE,
            },
            {
                path: SLA_BUSINESS_ROUTE,
                loadComponent: () =>
                    import('./sla-business-thresholds.component').then(
                        (m) => m.SlaBusinessThresholdsComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
            {
                path: SLA_SYSTEM_ROUTE,
                loadComponent: () =>
                    import('./sla-system-thresholds.component').then(
                        (m) => m.SlaSystemThresholdsComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
    {
        path: SLA_CHANNELS_ROUTE,
        loadComponent: () =>
            import('./sla-channels.component').then(
                (m) => m.SlaChannelsComponent
            ),
        data: { breadcrumb: { hide: true } },
    },
];
