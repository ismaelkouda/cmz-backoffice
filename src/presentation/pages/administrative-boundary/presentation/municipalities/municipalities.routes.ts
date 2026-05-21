import { Routes } from '@angular/router';
import { MunicipalitiesFormComponent } from '@presentation/pages/administrative-boundary/presentation/municipalities/municipalities-form/municipalities-form.component';
import { MunicipalitiesListComponent } from '@presentation/pages/administrative-boundary/presentation/municipalities/municipalities-list/municipalities-list.component';
import { MunicipalitiesPageComponent } from '@presentation/pages/administrative-boundary/presentation/municipalities/municipalities-page/municipalities-page.component';
import {
    MUNICIPALITIES_LIST_ROUTE,
    MUNICIPALITIES_HISTORY_ROUTE,
    MUNICIPALITIES_FORM_ROUTE,
} from '@presentation/pages/administrative-boundary/presentation/municipalities/municipalities-paths.constants';
import { HistoryPageComponent } from '@shared/components/history/presentation/features/history-page/history-page.component';

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
                pathMatch: 'full',
                redirectTo: MUNICIPALITIES_LIST_ROUTE,
            },
            {
                path: MUNICIPALITIES_LIST_ROUTE,
                component: MunicipalitiesListComponent,
                data: { breadcrumb: { hide: true } },
            },
            {
                path: MUNICIPALITIES_HISTORY_ROUTE,
                component: HistoryPageComponent,
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
                component: MunicipalitiesFormComponent,
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
                component: HistoryPageComponent,
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
];
