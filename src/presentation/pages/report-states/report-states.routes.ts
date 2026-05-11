import { Routes } from '@angular/router';
import { CloseComponent } from '@presentation/pages/report-states/presentation/features/close/close.component';
import { EvaluateComponent } from '@presentation/pages/report-states/presentation/features/evaluate/evaluate.component';
import { RejectComponent } from '@presentation/pages/report-states/presentation/features/reject/reject.component';

export const EVALUATE_ROUTE = 'evaluated';
export const CLOSE_ROUTE = 'closed';
export const REJECT_ROUTE = 'rejected';

export const routes: Routes = [
    {
        path: EVALUATE_ROUTE,
        data: {
            breadcrumb: {
                label: 'REPORT_STATES.EVALUATE.BREADCRUMB.LABEL',
                icon: 'REPORT_STATES.EVALUATE.BREADCRUMB.ICON',
            },
        },
        children: [
            {
                path: '',
                component: EvaluateComponent,
                data: { breadcrumb: { hide: true } },
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
    },
    {
        path: CLOSE_ROUTE,
        data: {
            breadcrumb: {
                label: 'REPORT_STATES.CLOSE.BREADCRUMB.LABEL',
                icon: 'REPORT_STATES.CLOSE.BREADCRUMB.ICON',
            },
        },
        children: [
            {
                path: '',
                component: CloseComponent,
                data: { breadcrumb: { hide: true } },
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
    },
    {
        path: REJECT_ROUTE,
        data: {
            breadcrumb: {
                label: 'REPORT_STATES.REJECT.BREADCRUMB.LABEL',
                icon: 'REPORT_STATES.REJECT.BREADCRUMB.ICON',
            },
        },
        children: [
            {
                path: '',
                component: RejectComponent,
                data: { breadcrumb: { hide: true } },
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
    },
];
