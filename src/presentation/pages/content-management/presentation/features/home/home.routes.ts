import { Routes } from '@angular/router';
import { HomeFormComponent } from '@pages/content-management/presentation/features/home/home-form/home-form.component';
import {
    HOME_LIST_ROUTE,
    HOME_HISTORY_ROUTE,
    HOME_FORM_ROUTE,
} from '@pages/content-management/presentation/features/home/home-paths.constants';
import { HomeListComponent } from '@presentation/pages/content-management/presentation/features/home/home-list/home-list.component';
import { HomePageComponent } from '@presentation/pages/content-management/presentation/features/home/home-page/home-page.component';
import { HistoryPageComponent } from '@shared/components/history/presentation/features/history-page/history-page.component';

export const HOME_ROUTES: Routes = [
    {
        path: '',
        component: HomePageComponent,
        data: {
            title: 'CONTENT_MANAGEMENT.HOME.TITLE',
            breadcrumb: 'CONTENT_MANAGEMENT.HOME.TITLE',
        },
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: HOME_LIST_ROUTE,
            },
            {
                path: HOME_LIST_ROUTE,
                component: HomeListComponent,
                data: { breadcrumb: { hide: true } },
            },
            {
                path: HOME_HISTORY_ROUTE,
                component: HistoryPageComponent,
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
    {
        path: `${HOME_FORM_ROUTE}`,
        data: {
            title: 'CONTENT_MANAGEMENT.HOME.FORM.TITLE',
            breadcrumb: 'CONTENT_MANAGEMENT.HOME.FORM.TITLE',
        },
        children: [
            {
                path: '',
                component: HomeFormComponent,
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
];
