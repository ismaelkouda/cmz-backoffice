import { Routes } from '@angular/router';

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
                loadComponent: () =>
                    import('@presentation/pages/requests/presentation/features/queues/queues.component').then(
                        (m) => m.QueuesComponent
                    ),
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
                loadComponent: () =>
                    import('@presentation/pages/requests/presentation/features/tasks/tasks.component').then(
                        (m) => m.TasksComponent
                    ),
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
                loadComponent: () =>
                    import('@presentation/pages/requests/presentation/features/all/all.component').then(
                        (m) => m.AllComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
    },
];
