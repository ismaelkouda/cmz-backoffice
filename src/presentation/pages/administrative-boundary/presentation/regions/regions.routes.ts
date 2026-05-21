import { Routes } from '@angular/router';
import { DepartmentsByRegionIdComponent } from '@presentation/pages/administrative-boundary/presentation/regions/departments-by-region-id/departments-by-region-id.component';
import { RegionsFormComponent } from '@presentation/pages/administrative-boundary/presentation/regions/regions-form/regions-form.component';
import { RegionsListComponent } from '@presentation/pages/administrative-boundary/presentation/regions/regions-list/regions-list.component';
import { RegionsPageComponent } from '@presentation/pages/administrative-boundary/presentation/regions/regions-page/regions-page.component';
import {
    REGIONS_LIST_ROUTE,
    REGIONS_HISTORY_ROUTE,
    REGIONS_FORM_ROUTE,
    REGIONS_DEPARTMENTS_ROUTE,
} from '@presentation/pages/administrative-boundary/presentation/regions/regions-paths.constants';
import { HistoryPageComponent } from '@shared/components/history/presentation/features/history-page/history-page.component';

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
                pathMatch: 'full',
                redirectTo: REGIONS_LIST_ROUTE,
            },
            {
                path: REGIONS_LIST_ROUTE,
                component: RegionsListComponent,
                data: { breadcrumb: { hide: true } },
            },
            {
                path: REGIONS_HISTORY_ROUTE,
                component: HistoryPageComponent,
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
                component: RegionsFormComponent,
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
    {
        path: `${REGIONS_DEPARTMENTS_ROUTE}`,
        component: DepartmentsByRegionIdComponent,
        data: {
            title: 'ADMINISTRATIVE_BOUNDARY.REGIONS.TITLE',
            breadcrumb: 'ADMINISTRATIVE_BOUNDARY.REGIONS.BREADCRUMB_LABEL',
        },
    },
];
