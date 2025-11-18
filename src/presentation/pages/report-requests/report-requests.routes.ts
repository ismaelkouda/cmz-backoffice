import { Routes } from '@angular/router';
import { ApprovalComponent } from './ui/approval/approval.component';
import { WaitingComponent } from './ui/waiting/waiting.component';

export const WAITING_ROUTE = 'queues';
export const APPROVAL_ROUTE = 'qualified';

export const routes: Routes = [
    {
        path: WAITING_ROUTE,
        children: [
            {
                path: '',
                component: WaitingComponent,
                data: {
                    title: 'REPORT_REQUESTS.WAITING.TITLE',
                    module: 'REPORT_REQUESTS.LABEL',
                    subModule: 'REPORT_REQUESTS.WAITING.LABEL',
                },
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
    },
    {
        path: APPROVAL_ROUTE,
        children: [
            {
                path: '',
                component: ApprovalComponent,
                data: {
                    title: 'REPORT_REQUESTS.APPROVAL.TITLE',
                    module: 'REPORT_REQUESTS.LABEL',
                    subModule: 'REPORT_REQUESTS.APPROVAL.LABEL',
                },
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
    },
];
