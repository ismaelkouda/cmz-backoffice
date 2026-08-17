import { Routes } from '@angular/router';

import {
    REGIONS_LIST_ROUTE,
    REGIONS_HISTORY_ROUTE,
    REGIONS_FORM_ROUTE,
    REGIONS_DEPARTMENTS_ROUTE,
} from '@presentation/pages/administrative-boundary/presentation/regions/regions-paths.constants';

export const REGIONS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('@presentation/pages/administrative-boundary/presentation/regions/regions-page/regions-page.component').then(
                (m) => m.RegionsPageComponent
            ),
        data: {
            icon: 'CONTENT_MANAGEMENT.REGIONS.TITLE',
            breadcrumb: 'CONTENT_MANAGEMENT.REGIONS.TITLE',
        },
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: REGIONS_LIST_ROUTE,
            },
            {
                path: REGIONS_LIST_ROUTE,
                loadComponent: () =>
                    import('@presentation/pages/administrative-boundary/presentation/regions/regions-list/regions-list.component').then(
                        (m) => m.RegionsListComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
            {
                path: REGIONS_HISTORY_ROUTE,
                loadComponent: () =>
                    import('@shared/components/history/presentation/features/history-page/history-page.component').then(
                        (m) => m.HistoryPageComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
    {
        path: `${REGIONS_FORM_ROUTE}`,
        data: {
            icon: 'CONTENT_MANAGEMENT.REGIONS.TITLE',
            breadcrumb: 'CONTENT_MANAGEMENT.REGIONS.TITLE',
        },
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('@presentation/pages/administrative-boundary/presentation/regions/regions-form/regions-form.component').then(
                        (m) => m.RegionsFormComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
    {
        path: `${REGIONS_DEPARTMENTS_ROUTE}`,
        loadComponent: () =>
            import('@presentation/pages/administrative-boundary/presentation/regions/departments-by-region-id/departments-by-region-id.component').then(
                (m) => m.DepartmentsByRegionIdComponent
            ),
        data: {
            title: 'ADMINISTRATIVE_BOUNDARY.REGIONS.TITLE',
            breadcrumb: 'ADMINISTRATIVE_BOUNDARY.REGIONS.BREADCRUMB_LABEL',
        },
    },
];
