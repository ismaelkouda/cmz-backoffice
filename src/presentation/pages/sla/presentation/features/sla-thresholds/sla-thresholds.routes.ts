import { Routes } from '@angular/router';

import { SLA_CHANNELS_ROUTE } from './sla-thresholds-paths.constants';

export const SLA_THRESHOLDS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./sla-thresholds.component').then(
                (m) => m.SlaThresholdsComponent
            ),
        data: {
            title: 'SLA.THRESHOLDS.TITLE',
            breadcrumb: 'SLA.THRESHOLDS.TITLE',
        },
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
