import { Routes } from '@angular/router';
import { AllComponent } from '@pages/requests/presentation/all/all.component';
import { QueuesComponent } from '@pages/requests/presentation/queues/queues.component';
import { TasksComponent } from '@pages/requests/presentation/tasks/tasks.component';

export const QUEUES_ROUTE = 'queues';
export const TASKS_ROUTE = 'tasks';
export const ALL_ROUTE = 'all';

export const routes: Routes = [
    {
        path: QUEUES_ROUTE,
        data: {
            breadcrumb: {
                label: 'REQUESTS.QUEUES.BREADCRUMB.LABEL',
                icon: 'REQUESTS.QUEUES.BREADCRUMB.ICON',
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
                label: 'REQUESTS.TASKS.BREADCRUMB.LABEL',
                icon: 'REQUESTS.TASKS.BREADCRUMB.ICON',
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
                label: 'REQUESTS.ALL.BREADCRUMB.LABEL',
                icon: 'REQUESTS.ALL.BREADCRUMB.ICON',
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
