import { Routes } from '@angular/router';

export const TREATMENT_ROUTE = 'processing';
export const QUEUES_ROUTE = 'queues';
export const TASKS_ROUTE = 'tasks';
export const ACTIONS_ROUTE = 'actions';
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
                label: 'PROCESSING.QUEUES.BREADCRUMB.LABEL',
                icon: 'PROCESSING.QUEUES.BREADCRUMB.ICON',
            },
        },
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('@presentation/pages/processing/presentation/features/queues/queues.component').then(
                        (m) => m.QueuesComponent
                    ),
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
                label: 'PROCESSING.TASKS.BREADCRUMB.LABEL',
                icon: 'PROCESSING.TASKS.BREADCRUMB.ICON',
            },
        },
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('@presentation/pages/processing/presentation/features/tasks/tasks.component').then(
                        (m) => m.TasksComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
            {
                path: ACTIONS_ROUTE,
                loadComponent: () =>
                    import('@pages/processing/presentation/actions-treatment/actions-treatment.component').then(
                        (m) => m.ActionsTreatmentComponent
                    ),
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
        path: ALL_ROUTE,
        data: {
            breadcrumb: {
                label: 'PROCESSING.ALL.BREADCRUMB.LABEL',
                icon: 'PROCESSING.ALL.BREADCRUMB.ICON',
            },
        },
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('@presentation/pages/processing/presentation/features/all/all.component').then(
                        (m) => m.AllComponent
                    ),
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
