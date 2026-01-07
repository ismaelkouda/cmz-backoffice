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
        data: {
            breadcrumb: {
                label: 'REPORTS_REQUESTS.QUEUES.BREADCRUMB.LABEL',
                icon: 'REPORTS_REQUESTS.QUEUES.BREADCRUMB.ICON',
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
    },
    {
        path: TASKS_ROUTE,
        data: {
            breadcrumb: {
                label: 'REPORTS_REQUESTS.TASKS.BREADCRUMB.LABEL',
                icon: 'REPORTS_REQUESTS.TASKS.BREADCRUMB.ICON',
            },
        },
        children: [
            {
                path: '',
                component: TasksComponent,
                data: { breadcrumb: { hide: true } },
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
    },
    {
        path: ALL_ROUTE,
        data: {
            breadcrumb: {
                label: 'REPORTS_REQUESTS.ALL.BREADCRUMB.LABEL',
                icon: 'REPORTS_REQUESTS.ALL.BREADCRUMB.ICON',
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
    },
];
