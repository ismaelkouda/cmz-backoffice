import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { ActionsTreatmentComponent } from './ui/actions-treatment/actions-treatment.component';
import { AllComponent } from './ui/all/all.component';
import { QueuesComponent } from './ui/queues/queues.component';
import { TasksComponent } from './ui/tasks/tasks.component';
import { TreatmentComponent } from './ui/treatment/treatment.component';

export const TREATMENT_ROUTE = 'processing';
export const QUEUES_ROUTE = 'queues';
export const TASKS_ROUTE = 'tasks';
export const ALL_ROUTE = 'all';
export const FINALIZE_ROUTE = 'finalization';
export const REPORT_TREATMENT_ROUTE = 'treatment';

export const NOTIFICATIONS = 'notifications';
export const SIM_DEMAND_ROUTE = 'subscriptions';
export const INVOICE_FORM_ROUTE = 'invoice-form';
export const REPORT_FINALIZE_ROUTE = 'finalization';

export const routes: Routes = [
    {
        path: QUEUES_ROUTE,
        data: {
            breadcrumb: {
                label: 'REPORTS_PROCESSING.QUEUES.BREADCRUMB.LABEL',
                icon: 'REPORTS_PROCESSING.QUEUES.BREADCRUMB.ICON',
            },
        },
        children: [
            {
                path: '',
                component: QueuesComponent,
                data: { breadcrumb: { hide: true } },
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
        // canActivate: [PagesGuard],
        // data: {
        //     allowedPaths: [`/${QUEUE_ROUTE}`],
        // },
    },
    {
        path: TASKS_ROUTE,
        data: {
            breadcrumb: {
                label: 'REPORTS_PROCESSING.TASKS.BREADCRUMB.LABEL',
                icon: 'REPORTS_PROCESSING.TASKS.BREADCRUMB.ICON',
            },
        },
        children: [
            {
                path: '',
                component: TasksComponent,
                data: { breadcrumb: { hide: true } },
            },
            {
                path: ':taskId',
                component: ActionsTreatmentComponent,
                data: {
                    breadcrumb: {
                        label: (s: ActivatedRouteSnapshot) =>
                            `#${s.params['taskId']}`,
                    },
                },
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
        // canActivate: [PagesGuard],
        // data: {
        //     allowedPaths: [`/${QUEUE_ROUTE}`],
        // },
    },
    {
        path: ALL_ROUTE,
        data: {
            breadcrumb: {
                label: 'REPORTS_PROCESSING.ALL.BREADCRUMB.LABEL',
                icon: 'REPORTS_PROCESSING.ALL.BREADCRUMB.ICON',
            },
        },
        children: [
            {
                path: '',
                component: AllComponent,
                data: { breadcrumb: { hide: true } },
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
        // canActivate: [PagesGuard],
        // data: {
        //     allowedPaths: [`/${QUEUE_ROUTE}`],
        // },
    },
    {
        path: TREATMENT_ROUTE,
        data: {
            breadcrumb: {
                label: 'REPORTS_PROCESSING.TREATMENT.BREADCRUMB.LABEL',
                icon: 'REPORTS_PROCESSING.TREATMENT.BREADCRUMB.ICON',
            },
        },
        children: [
            {
                path: '',
                component: TreatmentComponent,
                data: { breadcrumb: { hide: true } },
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
        // canActivate: [PagesGuard],
        // data: {
        //     allowedPaths: [`/${QUEUE_ROUTE}`],
        // },
    },
    {
        path: FINALIZE_ROUTE,
        data: {
            breadcrumb: {
                label: 'REPORTS_PROCESSING.FINALIZE.BREADCRUMB.LABEL',
                icon: 'REPORTS_PROCESSING.FINALIZE.BREADCRUMB.ICON',
            },
        },
        children: [
            {
                path: '',
                component: TreatmentComponent,
                data: { breadcrumb: { hide: true } },
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
        // canActivate: [PagesGuard],
        // data: {
        //     allowedPaths: [`/${QUEUE_ROUTE}`],
        // },
    },
    {
        path: NOTIFICATIONS,
        data: {
            breadcrumb: {
                label: 'REPORTS_PROCESSING.NOTIFICATIONS.BREADCRUMB.LABEL',
                icon: 'REPORTS_PROCESSING.NOTIFICATIONS.BREADCRUMB.ICON',
            },
        },
        children: [
            {
                path: '',
                component: TreatmentComponent,
                data: { breadcrumb: { hide: true } },
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
        // canActivate: [PagesGuard],
        // data: {
        //     allowedPaths: [`/${QUEUE_ROUTE}`],
        // },
    },
    {
        path: SIM_DEMAND_ROUTE,
        data: {
            breadcrumb: {
                label: 'REPORTS_PROCESSING.SIM_DEMAND.BREADCRUMB.LABEL',
                icon: 'REPORTS_PROCESSING.SIM_DEMAND.BREADCRUMB.ICON',
            },
        },
        children: [
            {
                path: '',
                component: TreatmentComponent,
                data: { breadcrumb: { hide: true } },
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
        // canActivate: [PagesGuard],
        // data: {
        //     allowedPaths: [`/${QUEUE_ROUTE}`],
        // },
    },
    {
        path: INVOICE_FORM_ROUTE,
        data: {
            breadcrumb: {
                label: 'REPORTS_PROCESSING.INVOICE_FORM.BREADCRUMB.LABEL',
                icon: 'REPORTS_PROCESSING.INVOICE_FORM.BREADCRUMB.ICON',
            },
        },
        children: [
            {
                path: '',
                component: TreatmentComponent,
                data: { breadcrumb: { hide: true } },
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
        // canActivate: [PagesGuard],
        // data: {
        //     allowedPaths: [`/${QUEUE_ROUTE}`],
        // },
    },
    {
        path: REPORT_TREATMENT_ROUTE,
        data: {
            breadcrumb: {
                label: 'REPORTS_PROCESSING.REPORT_TREATMENT.BREADCRUMB.LABEL',
                icon: 'REPORTS_PROCESSING.REPORT_TREATMENT.BREADCRUMB.ICON',
            },
        },
        children: [
            {
                path: '',
                component: TreatmentComponent,
                data: { breadcrumb: { hide: true } },
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
        // canActivate: [PagesGuard],
        // data: {
        //     allowedPaths: [`/${QUEUE_ROUTE}`],
        // },
    },
];
