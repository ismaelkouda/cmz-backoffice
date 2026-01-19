import { Routes } from '@angular/router';
import { DepartmentsByRegionIdComponent } from './departments-by-region-id/departments-by-region-id.component';
import { RegionsFormComponent } from './regions-form/regions-form.component';
import { RegionsListComponent } from './regions-list/regions-list.component';
import { RegionsPageComponent } from './regions-page/regions-page.component';

export const REGIONS_FORM = 'form';
export const DEPARTMENTS_BY_REGION_ID_ROUTE = 'departments-by-region-id';

export const REGIONS_ROUTES: Routes = [
    {
        path: '',
        component: RegionsPageComponent,
        data: {
            icon: 'CONTENT_MANAGEMENT.REGIONS.TITLE',
            breadcrumb: 'CONTENT_MANAGEMENT.REGIONS.TITLE',
        },
        children: [
            {
                path: '',
                component: RegionsListComponent,
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
    {
        path: `${REGIONS_FORM}`,
        data: {
            icon: 'CONTENT_MANAGEMENT.REGIONS.TITLE',
            breadcrumb: 'CONTENT_MANAGEMENT.REGIONS.TITLE',
        },
        children: [
            {
                path: '',
                component: RegionsFormComponent,
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
    {
        path: `${DEPARTMENTS_BY_REGION_ID_ROUTE}`,
        component: DepartmentsByRegionIdComponent,
        data: {
            title: 'ADMINISTRATIVE_BOUNDARY.REGIONS.TITLE',
            breadcrumb: 'ADMINISTRATIVE_BOUNDARY.REGIONS.BREADCRUMB_LABEL',
        },
    }
];
