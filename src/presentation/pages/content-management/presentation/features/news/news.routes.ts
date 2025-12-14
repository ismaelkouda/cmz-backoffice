import { Routes } from '@angular/router';
import { FormNewsComponent } from './form-news/form-news.component';
import { NewsComponent } from './pages/news.component';

export const NEWS_CREATE_ROUTE = 'create';
export const NEWS_EDIT_ROUTE = 'edit';
export const NEWS_VIEW_ROUTE = 'view';

export const NEWS_ROUTES: Routes = [
    {
        path: '',
        component: NewsComponent,
        data: {
            title: 'CONTENT_MANAGEMENT.NEWS.TITLE',
            breadcrumb: 'CONTENT_MANAGEMENT.NEWS.TITLE',
        },
    },
    {
        path: `${NEWS_CREATE_ROUTE}`,
        component: FormNewsComponent,
        data: {
            title: 'CONTENT_MANAGEMENT.NEWS.CREATE.TITLE',
            breadcrumb: 'CONTENT_MANAGEMENT.NEWS.CREATE.TITLE',
        },
    },
    {
        path: `:id/${NEWS_EDIT_ROUTE}`,
        component: FormNewsComponent,
        data: {
            title: 'CONTENT_MANAGEMENT.NEWS.EDIT.TITLE',
            breadcrumb: 'CONTENT_MANAGEMENT.NEWS.EDIT.TITLE',
        },
    },
    /* {
        path: NEWS_VIEW_ROUTE,
        component: ViewNewsComponent,
        data: {
            title: 'CONTENT_MANAGEMENT.NEWS.VIEW.TITLE',
            breadcrumb: 'CONTENT_MANAGEMENT.NEWS.VIEW.TITLE',
        },
    } */
];
