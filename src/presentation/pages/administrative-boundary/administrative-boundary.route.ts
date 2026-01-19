import { Routes } from '@angular/router';

export const DEPARTMENTS_ROUTE = 'departments';
export const MUNICIPALITIES_ROUTE = 'municipalities';
export const REGIONS_ROUTE = 'regions';

export const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: DEPARTMENTS_ROUTE,
                data: {
                    breadcrumb: {
                        label: 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.BREADCRUMB.LABEL',
                        icon: 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.BREADCRUMB.ICON',
                    },
                },
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import(
                                './presentation/features/departments/departments.routes'
                            ).then((m) => m.DEPARTMENTS_ROUTES),
                        data: { breadcrumb: { hide: true } },
                    },
                    {
                        path: '**',
                        redirectTo: '',
                    },
                ],
            },
            {
                path: MUNICIPALITIES_ROUTE,
                data: {
                    breadcrumb: {
                        label: 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.BREADCRUMB.LABEL',
                        icon: 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.BREADCRUMB.ICON',
                    },
                },
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import(
                                './presentation/features/municipalities/municipalities.routes'
                            ).then((m) => m.MUNICIPALITIES_ROUTES),
                        data: { breadcrumb: { hide: true } },
                    },
                    {
                        path: '**',
                        redirectTo: '',
                    },
                ],
            },
            {
                path: REGIONS_ROUTE,
                data: {
                    breadcrumb: {
                        label: 'ADMINISTRATIVE_BOUNDARY.REGIONS.BREADCRUMB.LABEL',
                        icon: 'ADMINISTRATIVE_BOUNDARY.REGIONS.BREADCRUMB.ICON',
                    },
                },
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import(
                                './presentation/features/regions/regions.routes'
                            ).then((m) => m.REGIONS_ROUTES),
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
                redirectTo: DEPARTMENTS_ROUTE,
            },
        ],
    },
];
