import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'baseline',
            },
            {
                path: 'baseline',
                loadComponent: () =>
                    import('@pages/sla/presentation/features/sla-list/sla-list.component').then(
                        (m) => m.SlaListComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
            {
                path: 'thresholds',
                loadComponent: () =>
                    import('@pages/sla/presentation/features/sla-thresholds/sla-thresholds.component').then(
                        (m) => m.SlaThresholdsComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
            {
                path: 'thresholds/channels',
                loadComponent: () =>
                    import('@pages/sla/presentation/features/sla-thresholds/sla-channels.component').then(
                        (m) => m.SlaChannelsComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
];
