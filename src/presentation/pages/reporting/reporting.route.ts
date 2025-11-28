import { Routes } from '@angular/router';
import { ReportComponent } from './ui/report/report.component';

export const REPORT_ROUTE = 'reports';
export const REQUESTS_ROUTE = 'requests';

export const routes: Routes = [
    {
        path: REPORT_ROUTE,
        children: [
            {
                path: '',
                component: ReportComponent,
                data: {
                    title: 'REPORTING.REPORT.TITLE',
                    module: 'REPORTING.LABEL',
                    subModule: 'REPORTING.REPORT.LABEL',
                },
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
    },
    {
        path: REQUESTS_ROUTE,
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('./ui/requests/requests.component').then(
                        (m) => m.RequestsComponent
                    ),
                data: {
                    title: 'REPORTING.REQUESTS.TITLE',
                    module: 'REPORTING.LABEL',
                    subModule: 'REPORTING.REQUESTS.LABEL',
                },
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
    },
];
