import { Routes } from '@angular/router';
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
        children: [
            {
                path: '',
                component: QueuesComponent,
                data: {
                    title: 'REPORTS_PROCESSING.QUEUES.TITLE',
                    module: 'REPORTS_PROCESSING.LABEL',
                    subModule: 'REPORTS_PROCESSING.QUEUES.LABEL',
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
        path: TASKS_ROUTE,
        children: [
            {
                path: '',
                component: TasksComponent,
                data: {
                    title: 'REPORTS_PROCESSING.TASKS.TITLE',
                    module: 'REPORTS_PROCESSING.LABEL',
                    subModule: 'REPORTS_PROCESSING.TASKS.LABEL',
                },
            },
            {
                path: ':taskId',
                component: ActionsTreatmentComponent,
                data: {
                    title: 'ACTIONS.TITLE',
                    module: 'REPORTS_PROCESSING.LABEL',
                    subModule: 'ACTIONS.LABEL',
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
        children: [
            {
                path: '',
                component: AllComponent,
                data: {
                    title: 'REPORTS_PROCESSING.ALL.TITLE',
                    module: 'REPORTS_PROCESSING.LABEL',
                    subModule: 'REPORTS_PROCESSING.ALL.LABEL',
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
        path: TREATMENT_ROUTE,
        children: [
            {
                path: '',
                component: TreatmentComponent,
                data: {
                    title: 'REPORTS_PROCESSING.TREATMENT.TITLE',
                    module: 'REPORTS_PROCESSING.LABEL',
                    subModule: 'REPORTS_PROCESSING.TREATMENT.LABEL',
                },
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
        // canActivate: [PagesGuard],
        // data: {
        //     allowedPaths: [`/${TREATMENT_ROUTE}`],
        // },
    },
];
