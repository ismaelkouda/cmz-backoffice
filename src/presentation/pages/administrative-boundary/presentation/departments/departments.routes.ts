import { Routes } from '@angular/router';

import {
    DEPARTMENTS_LIST_ROUTE,
    DEPARTMENTS_HISTORY_ROUTE,
    DEPARTMENTS_FORM_ROUTE,
    DEPARTMENTS_MUNICIPALITIES_ROUTE,
} from '@presentation/pages/administrative-boundary/presentation/departments/departments-paths.constants';

export const DEPARTMENTS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('@presentation/pages/administrative-boundary/presentation/departments/departments-page/departments-page.component').then(
                (m) => m.DepartmentsPageComponent
            ),
        data: {
            icon: 'CONTENT_MANAGEMENT.DEPARTMENTS.TITLE',
            breadcrumb: 'CONTENT_MANAGEMENT.DEPARTMENTS.TITLE',
        },
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: DEPARTMENTS_LIST_ROUTE,
            },
            {
                path: DEPARTMENTS_LIST_ROUTE,
                loadComponent: () =>
                    import('@presentation/pages/administrative-boundary/presentation/departments/departments-list/departments-list.component').then(
                        (m) => m.DepartmentsListComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
            {
                path: DEPARTMENTS_HISTORY_ROUTE,
                loadComponent: () =>
                    import('@shared/components/history/presentation/features/history-page/history-page.component').then(
                        (m) => m.HistoryPageComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
    {
        path: `${DEPARTMENTS_FORM_ROUTE}`,
        data: {
            icon: 'CONTENT_MANAGEMENT.DEPARTMENTS.TITLE',
            breadcrumb: 'CONTENT_MANAGEMENT.DEPARTMENTS.TITLE',
        },
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('@presentation/pages/administrative-boundary/presentation/departments/departments-form/departments-form.component').then(
                        (m) => m.DepartmentsFormComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
    {
        path: `${DEPARTMENTS_MUNICIPALITIES_ROUTE}`,
        loadComponent: () =>
            import('@presentation/pages/administrative-boundary/presentation/departments/municipalities-by-department-id/municipalities-by-department-id.component').then(
                (m) => m.MunicipalitiesByDepartmentIdComponent
            ),
        data: {
            title: 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.TITLE',
            breadcrumb:
                'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.BREADCRUMB_LABEL',
        },
    },
];
