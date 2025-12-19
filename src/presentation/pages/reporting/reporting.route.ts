import { Routes } from '@angular/router';
import { ReportComponent } from './ui/report/report.component';

export const REPORT_ROUTE = 'reports';
export const REQUESTS_ROUTE = 'requests';

export const routes: Routes = [
    {
        path: REPORT_ROUTE,
        data: {
            breadcrumb: {
                label: 'REPORTING.REPORT.BREADCRUMB.LABEL',
                icon: 'REPORTING.REPORT.BREADCRUMB.ICON',
            }
        },
        children: [
            {
                path: '',
                component: ReportComponent,
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
            }
        },
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('./ui/requests/requests.component').then(
                        (m) => m.RequestsComponent
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
