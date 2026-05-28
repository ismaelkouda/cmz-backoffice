import { Routes } from '@angular/router';

export const MAP_CLUSTERS_ROUTE = 'queues';
export const TASKS_ROUTE = 'tasks';
export const ALL_ROUTE = 'all';

export const routes: Routes = [
    {
        path: MAP_CLUSTERS_ROUTE,
        data: {
            breadcrumb: {
                label: 'INTERACTIVE_MAP.MAP_CLUSTERS.BREADCRUMB.LABEL',
                icon: 'INTERACTIVE_MAP.MAP_CLUSTERS.BREADCRUMB.ICON',
            },
        },
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('@presentation/pages/interactive-map/presentation/features/interactive-map/pages/interactive-map.component').then(
                        (m) => m.InteractiveMapComponent
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
