import { Routes } from '@angular/router';

export const MAP_ROUTE = 'interactive';
export const MAP_VISUALIZATION_ROUTE = 'visualization';

export const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: MAP_ROUTE,
                data: {
                    breadcrumb: {
                        label: 'INTERACTIVE_MAP.MAP.BREADCRUMB.LABEL',
                        icon: 'INTERACTIVE_MAP.MAP.BREADCRUMB.ICON',
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
            {
                path: MAP_VISUALIZATION_ROUTE,
                data: {
                    breadcrumb: {
                        label: 'INTERACTIVE_MAP.DASHBOARD.BREADCRUMB.LABEL',
                        icon: 'INTERACTIVE_MAP.DASHBOARD.BREADCRUMB.ICON',
                    },
                },
                children: [
                    {
                        path: '',
                        loadComponent: () =>
                            import('@presentation/pages/interactive-map/presentation/features/dashboard-map/map-page.component').then(
                                (m) => m.MapPageComponent
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
                path: '**',
                redirectTo: MAP_ROUTE,
            },
        ],
    },
];
