import { Routes } from '@angular/router';

export const SLA_ALERT_CHANNEL_HISTORY_ROUTE = 'history';

export const SLA_ALERT_CHANNEL_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./sla-alert-channel-page.component').then(
                (m) => m.SlaAlertChannelPageComponent
            ),
        data: {
            title: 'SLA.ALERT_CHANNEL.TITLE',
            breadcrumb: 'SLA.ALERT_CHANNEL.TITLE',
        },
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('./sla-alert-channel.component').then(
                        (m) => m.SlaAlertChannelComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
            {
                path: SLA_ALERT_CHANNEL_HISTORY_ROUTE,
                loadComponent: () =>
                    import('@shared/components/history/presentation/features/history-page/history-page.component').then(
                        (m) => m.HistoryPageComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
];
