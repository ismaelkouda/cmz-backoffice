import { Routes } from '@angular/router';

import {
    MUNICIPALITIES_LIST_ROUTE,
    MUNICIPALITIES_HISTORY_ROUTE,
    MUNICIPALITIES_FORM_ROUTE,
} from '@presentation/pages/administrative-boundary/presentation/municipalities/municipalities-paths.constants';

export const MUNICIPALITIES_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('@presentation/pages/administrative-boundary/presentation/municipalities/municipalities-page/municipalities-page.component').then(
                (m) => m.MunicipalitiesPageComponent
            ),
        data: {
            title: 'CONTENT_MANAGEMENT.MUNICIPALITIES.TITLE',
            breadcrumb: 'CONTENT_MANAGEMENT.MUNICIPALITIES.TITLE',
        },
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: MUNICIPALITIES_LIST_ROUTE,
            },
            {
                path: MUNICIPALITIES_LIST_ROUTE,
                loadComponent: () =>
                    import('@presentation/pages/administrative-boundary/presentation/municipalities/municipalities-list/municipalities-list.component').then(
                        (m) => m.MunicipalitiesListComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
            {
                path: MUNICIPALITIES_HISTORY_ROUTE,
                loadComponent: () =>
                    import('@shared/components/history/presentation/features/history-page/history-page.component').then(
                        (m) => m.HistoryPageComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
    {
        path: `${MUNICIPALITIES_FORM_ROUTE}`,
        data: {
            title: 'CONTENT_MANAGEMENT.MUNICIPALITIES.TITLE',
            breadcrumb: 'CONTENT_MANAGEMENT.MUNICIPALITIES.TITLE',
        },
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('@presentation/pages/administrative-boundary/presentation/municipalities/municipalities-form/municipalities-form.component').then(
                        (m) => m.MunicipalitiesFormComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
    {
        path: `${MUNICIPALITIES_HISTORY_ROUTE}`,
        data: {
            title: 'CONTENT_MANAGEMENT.MUNICIPALITIES.HISTORY.TITLE',
            breadcrumb: 'CONTENT_MANAGEMENT.MUNICIPALITIES.HISTORY.TITLE',
        },
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('@shared/components/history/presentation/features/history-page/history-page.component').then(
                        (m) => m.HistoryPageComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
];
