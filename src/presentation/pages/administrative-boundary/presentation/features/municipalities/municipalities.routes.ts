import { Routes } from '@angular/router';
import { MunicipalitiesFormComponent } from './municipalities-form/municipalities-form.component';
import { MunicipalitiesListComponent } from './municipalities-list/municipalities-list.component';
import { MunicipalitiesPageComponent } from './municipalities-page/municipalities-page.component';

export const MUNICIPALITIES_FORM = 'form';
export const DEPARTMENTS_BY_MUNICIPALITY_ID_ROUTE = 'departments-by-municipality-id';

export const MUNICIPALITIES_ROUTES: Routes = [
    {
        path: '',
        component: MunicipalitiesPageComponent,
        data: {
            title: 'CONTENT_MANAGEMENT.MUNICIPALITIES.TITLE',
            breadcrumb: 'CONTENT_MANAGEMENT.MUNICIPALITIES.TITLE',
        },
        children: [
            {
                path: '',
                component: MunicipalitiesListComponent,
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
    {
        path: `${MUNICIPALITIES_FORM}`,
        data: {
            title: 'CONTENT_MANAGEMENT.MUNICIPALITIES.TITLE',
            breadcrumb: 'CONTENT_MANAGEMENT.MUNICIPALITIES.TITLE',
        },
        children: [
            {
                path: '',
                component: MunicipalitiesFormComponent,
                data: { breadcrumb: { hide: true } },
            },
        ],
    }
];
