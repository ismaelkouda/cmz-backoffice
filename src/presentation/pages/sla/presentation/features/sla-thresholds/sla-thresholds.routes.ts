import { Routes } from '@angular/router';

export const SLA_THRESHOLDS_HISTORY_ROUTE = 'history';

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
                loadComponent: () =>
                    import('./sla-thresholds.component').then(
                        (m) => m.SlaThresholdsComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
            {
                path: SLA_THRESHOLDS_HISTORY_ROUTE,
                loadComponent: () =>
                    import('@shared/components/history/presentation/features/history-page/history-page.component').then(
                        (m) => m.HistoryPageComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
];
