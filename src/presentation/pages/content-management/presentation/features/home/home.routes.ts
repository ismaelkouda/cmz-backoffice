import { Routes } from '@angular/router';

import {
    HOME_LIST_ROUTE,
    HOME_HISTORY_ROUTE,
    HOME_FORM_ROUTE,
} from '@pages/content-management/presentation/features/home/home-paths.constants';

export const HOME_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('@presentation/pages/content-management/presentation/features/home/home-page/home-page.component').then(
                (m) => m.HomePageComponent
            ),
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
                loadComponent: () =>
                    import('@presentation/pages/content-management/presentation/features/home/home-list/home-list.component').then(
                        (m) => m.HomeListComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
            {
                path: HOME_HISTORY_ROUTE,
                loadComponent: () =>
                    import('@shared/components/history/presentation/features/history-page/history-page.component').then(
                        (m) => m.HistoryPageComponent
                    ),
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
                loadComponent: () =>
                    import('@pages/content-management/presentation/features/home/home-form/home-form.component').then(
                        (m) => m.HomeFormComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
];
