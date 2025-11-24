import { Routes } from '@angular/router';
import { AllComponent } from './ui/all/all.component';
import { QueuesComponent } from './ui/queues/queues.component';
import { TasksComponent } from './ui/tasks/tasks.component';

export const QUEUES_ROUTE = 'queues';
export const TASKS_ROUTE = 'tasks';
export const ALL_ROUTE = 'all';

export const routes: Routes = [
    {
        path: QUEUES_ROUTE,
        children: [
            {
                path: '',
                component: QueuesComponent,
                data: {
                    title: 'REPORTS_REQUESTS.QUEUES.TITLE',
                    module: 'REPORTS_REQUESTS.LABEL',
                    subModule: 'REPORTS_REQUESTS.QUEUES.LABEL',
                },
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
    },
    {
        path: TASKS_ROUTE,
        children: [
            {
                path: '',
                component: TasksComponent,
                data: {
                    title: 'REPORTS_REQUESTS.TASKS.TITLE',
                    module: 'REPORTS_REQUESTS.LABEL',
                    subModule: 'REPORTS_REQUESTS.TASKS.LABEL',
                },
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
    },
    {
        path: ALL_ROUTE,
        children: [
            {
                path: '',
                component: AllComponent,
                data: {
                    title: 'REPORTS_REQUESTS.ALL.TITLE',
                    module: 'REPORTS_REQUESTS.LABEL',
                    subModule: 'REPORTS_REQUESTS.ALL.LABEL',
                },
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
    },
];
