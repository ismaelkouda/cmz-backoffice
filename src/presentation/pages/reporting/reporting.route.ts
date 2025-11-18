import { Routes } from '@angular/router';
import { ReportComponent } from './ui/report/report.component';

export const REPORTING_ROUTE = 'reporting';

export const routes: Routes = [
    {
        path: REPORTING_ROUTE,
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
];
