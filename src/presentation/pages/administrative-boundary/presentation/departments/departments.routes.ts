import { Routes } from '@angular/router';
import { DepartmentsFormComponent } from '@presentation/pages/administrative-boundary/presentation/departments/departments-form/departments-form.component';
import { DepartmentsListComponent } from '@presentation/pages/administrative-boundary/presentation/departments/departments-list/departments-list.component';
import { DepartmentsPageComponent } from '@presentation/pages/administrative-boundary/presentation/departments/departments-page/departments-page.component';
import {
    DEPARTMENTS_LIST_ROUTE,
    DEPARTMENTS_HISTORY_ROUTE,
    DEPARTMENTS_FORM_ROUTE,
    DEPARTMENTS_MUNICIPALITIES_ROUTE,
} from '@presentation/pages/administrative-boundary/presentation/departments/departments-paths.constants';
import { MunicipalitiesByDepartmentIdComponent } from '@presentation/pages/administrative-boundary/presentation/departments/municipalities-by-department-id/municipalities-by-department-id.component';
import { HistoryPageComponent } from '@shared/components/history/presentation/features/history-page/history-page.component';

export const DEPARTMENTS_ROUTES: Routes = [
    {
        path: '',
        component: DepartmentsPageComponent,
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
                component: DepartmentsListComponent,
                data: { breadcrumb: { hide: true } },
            },
            {
                path: DEPARTMENTS_HISTORY_ROUTE,
                component: HistoryPageComponent,
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
                component: DepartmentsFormComponent,
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
    {
        path: `${DEPARTMENTS_MUNICIPALITIES_ROUTE}`,
        component: MunicipalitiesByDepartmentIdComponent,
        data: {
            title: 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.TITLE',
            breadcrumb:
                'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.BREADCRUMB_LABEL',
        },
    },
];
