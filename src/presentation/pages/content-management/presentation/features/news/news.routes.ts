import { Routes } from '@angular/router';

import {
    NEWS_LIST_ROUTE,
    NEWS_HISTORY_ROUTE,
    NEWS_FORM_ROUTE,
} from '@pages/content-management/presentation/features/news/news-paths.constants';

export const NEWS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('@presentation/pages/content-management/presentation/features/news/news-page/news-page.component').then(
                (m) => m.NewsPageComponent
            ),
        data: {
            title: 'CONTENT_MANAGEMENT.NEWS.TITLE',
            breadcrumb: 'CONTENT_MANAGEMENT.NEWS.TITLE',
        },
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: NEWS_LIST_ROUTE,
            },
            {
                path: NEWS_LIST_ROUTE,
                loadComponent: () =>
                    import('@presentation/pages/content-management/presentation/features/news/news-list/news-list.component').then(
                        (m) => m.NewsListComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
            {
                path: NEWS_HISTORY_ROUTE,
                loadComponent: () =>
                    import('@shared/components/history/presentation/features/history-page/history-page.component').then(
                        (m) => m.HistoryPageComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
    {
        path: `${NEWS_FORM_ROUTE}`,
        data: {
            title: 'CONTENT_MANAGEMENT.NEWS.FORM.TITLE',
            breadcrumb: 'CONTENT_MANAGEMENT.NEWS.FORM.TITLE',
        },
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('@pages/content-management/presentation/features/news/news-form/news-form.component').then(
                        (m) => m.NewsFormComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
];
