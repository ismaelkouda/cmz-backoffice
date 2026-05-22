import { Routes } from '@angular/router';
import { NewsFormComponent } from '@pages/content-management/presentation/features/news/news-form/news-form.component';
import {
    NEWS_LIST_ROUTE,
    NEWS_HISTORY_ROUTE,
    NEWS_FORM_ROUTE,
} from '@pages/content-management/presentation/features/news/news-paths.constants';
import { NewsListComponent } from '@presentation/pages/content-management/presentation/features/news/news-list/news-list.component';
import { NewsPageComponent } from '@presentation/pages/content-management/presentation/features/news/news-page/news-page.component';
import { HistoryPageComponent } from '@shared/components/history/presentation/features/history-page/history-page.component';

export const NEWS_ROUTES: Routes = [
    {
        path: '',
        component: NewsPageComponent,
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
                component: NewsListComponent,
                data: { breadcrumb: { hide: true } },
            },
            {
                path: NEWS_HISTORY_ROUTE,
                component: HistoryPageComponent,
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
                component: NewsFormComponent,
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
];
