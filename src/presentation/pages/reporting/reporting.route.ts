import { Routes } from '@angular/router';

export const REPORT_ROUTE = 'reports';
export const REQUESTS_ROUTE = 'requests';

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
                            import(
                                './presentation/features/report/pages/report-page/report-page.component'
                            ).then((m) => m.ReportPageComponent),
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
                            import(
                                './presentation/features/requests/pages/requests-page/requests-page.component'
                            ).then((m) => m.RequestsPageComponent),
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
