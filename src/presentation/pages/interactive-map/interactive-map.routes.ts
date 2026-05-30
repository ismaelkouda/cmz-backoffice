import { Routes } from '@angular/router';

export const MAP_ROUTE = 'interactive';

export const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: MAP_ROUTE,
                data: {
                    breadcrumb: {
                        label: 'GEOGRAPHICAL_MAP.MAP.BREADCRUMB.LABEL',
                        icon: 'GEOGRAPHICAL_MAP.MAP.BREADCRUMB.ICON',
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
                path: '**',
                redirectTo: MAP_ROUTE,
            },
        ],
    },
];
