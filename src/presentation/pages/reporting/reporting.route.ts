import { Routes } from '@angular/router';

export const REPORT_ROUTE = 'reports';
export const REQUESTS_ROUTE = 'requests';
export const REPORT_BY_CHANNEL_ROUTE = 'report-by-channel';
export const REPORT_BY_OPERATOR_ROUTE = 'report-by-operator';

export const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: REPORT_ROUTE,
                data: {
                    breadcrumb: {
                        label: 'REPORTING.REPORT.BREADCRUMB.LABEL',
                        icon: 'REPORTING.REPORT.BREADCRUMB.ICON',
                    },
                },
                children: [
                    {
                        path: '',
                        loadComponent: () =>
                            import('./presentation/features/report/pages/report-page/report-page.component').then(
                                (m) => m.ReportPageComponent
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
                path: REQUESTS_ROUTE,
                data: {
                    breadcrumb: {
                        label: 'REPORTING.REQUESTS.BREADCRUMB.LABEL',
                        icon: 'REPORTING.REQUESTS.BREADCRUMB.ICON',
                    },
                },
                children: [
                    {
                        path: '',
                        loadComponent: () =>
                            import('./presentation/features/requests/pages/requests-page/requests-page.component').then(
                                (m) => m.RequestsPageComponent
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
                path: REPORT_BY_CHANNEL_ROUTE,
                data: {
                    breadcrumb: {
                        label: 'REPORTING.REPORT_BY_CHANNEL.BREADCRUMB.LABEL',
                        icon: 'REPORTING.REPORT_BY_CHANNEL.BREADCRUMB.ICON',
                    },
                },
                children: [
                    {
                        path: '',
                        loadComponent: () =>
                            import('./presentation/features/report-by-channel/pages/report-by-channel-page/report-by-channel-page.component').then(
                                (m) => m.ReportByChannelPageComponent
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
                path: REPORT_BY_OPERATOR_ROUTE,
                data: {
                    breadcrumb: {
                        label: 'REPORTING.REPORT_BY_OPERATOR.BREADCRUMB.LABEL',
                        icon: 'REPORTING.REPORT_BY_OPERATOR.BREADCRUMB.ICON',
                    },
                },
                children: [
                    {
                        path: '',
                        loadComponent: () =>
                            import('./presentation/features/report-by-operator/pages/report-by-operator-page/report-by-operator-page.component').then(
                                (m) => m.ReportByOperatorPageComponent
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
                path: '**',
                redirectTo: REPORT_ROUTE,
            },
        ],
    },
];
