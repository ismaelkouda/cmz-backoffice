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
                            import('./presentation/features/map/pages/map-page/map-page.component').then(
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
