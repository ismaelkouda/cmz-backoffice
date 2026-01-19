import { Routes } from '@angular/router';
import { DepartmentsFormComponent } from './departments-form/departments-form.component';
import { DepartmentsListComponent } from './departments-list/departments-list.component';
import { DepartmentsPageComponent } from './departments-page/departments-page.component';
import { MunicipalitiesByDepartmentIdComponent } from './municipalities-by-department-id/municipalities-by-department-id.component';

export const DEPARTMENTS_FORM = 'form';
export const MUNICIPALITIES_BY_DEPARTMENT_ID_ROUTE = 'municipalities-by-department-id';

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
                component: DepartmentsListComponent,
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
    {
        path: `${DEPARTMENTS_FORM}`,
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
        path: `${MUNICIPALITIES_BY_DEPARTMENT_ID_ROUTE}`,
        component: MunicipalitiesByDepartmentIdComponent,
        data: {
            title: 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.TITLE',
            breadcrumb: 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.BREADCRUMB_LABEL',
        },
    },
];
