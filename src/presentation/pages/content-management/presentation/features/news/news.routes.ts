import { Routes } from '@angular/router';
import { NewsFormComponent } from '@pages/content-management/presentation/features/news/news-form/news-form.component';
import { NewsPageComponent } from '@pages/content-management/presentation/features/news/news-page/news-page.component';

export const NEWS_FORM = 'form';

export const NEWS_ROUTES: Routes = [
    {
        path: '',
        data: {
            title: 'CONTENT_MANAGEMENT.NEWS.TITLE',
            breadcrumb: 'CONTENT_MANAGEMENT.NEWS.TITLE',
        },
        children: [
            {
                path: '',
                component: NewsPageComponent,
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
    {
        path: `${NEWS_FORM}`,
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
