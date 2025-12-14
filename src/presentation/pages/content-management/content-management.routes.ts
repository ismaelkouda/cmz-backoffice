import { Routes } from '@angular/router';
import { FormHomeComponent } from './presentation/features/home/form-home/form-home.component';
import { HomeComponent } from './presentation/features/home/pages/home.component';
import { ViewHomeComponent } from './presentation/features/home/pages/view-home/view-home.component';

export const HOME_ROUTE = 'home-blocks';
export const NEWS_ROUTE = 'infos-and-news';
export const SLIDE_ROUTE = 'sliders';
export const PRIVACY_POLICY_ROUTE = 'privacy-policy';
export const LEGAL_NOTICE_ROUTE = 'legal-notices';
export const TERMS_USE_ROUTE = 'terms-of-service';
export const CREATE_ROUTE = 'create';
export const EDIT_ROUTE = 'edit';
export const VIEW_ROUTE = 'view';

export const routes: Routes = [
    {
        path: HOME_ROUTE,
        children: [
            {
                path: '',
                component: HomeComponent,
                data: {
                    title: 'CONTENT_MANAGEMENT.TITLE',
                    module: 'CONTENT_MANAGEMENT.LABEL',
                    subModule: 'CONTENT_MANAGEMENT.LABEL',
                },
            },
            {
                path: CREATE_ROUTE,
                component: FormHomeComponent,
                data: {
                    title: 'CONTENT_MANAGEMENT.HOME.TITLE',
                    module: 'CONTENT_MANAGEMENT.LABEL',
                    subModule: 'CONTENT_MANAGEMENT.HOME.LABEL',
                },
            },
            {
                path: `:id/${EDIT_ROUTE}`,
                component: FormHomeComponent,
                data: {
                    title: 'CONTENT_MANAGEMENT.HOME.TITLE',
                    module: 'CONTENT_MANAGEMENT.LABEL',
                    subModule: 'CONTENT_MANAGEMENT.HOME.LABEL',
                },
            },
            {
                path: `:id/${VIEW_ROUTE}`,
                component: ViewHomeComponent,
                data: {
                    title: 'CONTENT_MANAGEMENT.HOME.TITLE',
                    module: 'CONTENT_MANAGEMENT.LABEL',
                    subModule: 'CONTENT_MANAGEMENT.HOME.LABEL',
                },
            },
            { path: '**', redirectTo: '' },
        ],
    },
    {
        path: NEWS_ROUTE,
        children: [
            {
                path: '',
                loadChildren: () => import('./presentation/features/news/news.routes').then(m => m.NEWS_ROUTES),
                data: {
                    title: 'CONTENT_MANAGEMENT.NEWS.TITLE',
                    module: 'CONTENT_MANAGEMENT.LABEL',
                    subModule: 'CONTENT_MANAGEMENT.NEWS.LABEL',
                },
            },
        ],
    },

    {
        path: SLIDE_ROUTE,
        children: [
            {
                path: '',
                loadChildren: () => import('./presentation/features/slide/slide.routes').then((m) => m.SLIDE_ROUTES),
                data: {
                    title: 'CONTENT_MANAGEMENT.SLIDE.TITLE',
                    module: 'CONTENT_MANAGEMENT.LABEL',
                    subModule: 'CONTENT_MANAGEMENT.SLIDE.LABEL',
                },
            },
        ],
    },

    {
        path: PRIVACY_POLICY_ROUTE,
        children: [
            {
                path: '',
                loadChildren: () => import('./presentation/features/privacy-policy/privacy-policy.routes').then((m) => m.PRIVACY_POLICY_ROUTES),
                data: {
                    title: 'CONTENT_MANAGEMENT.PRIVACY_POLICY.TITLE',
                    module: 'CONTENT_MANAGEMENT.LABEL',
                    subModule: 'CONTENT_MANAGEMENT.PRIVACY_POLICY.LABEL',
                },
            },
        ],
    },

    {
        path: TERMS_USE_ROUTE,
        children: [
            {
                path: '',
                loadChildren: () => import('./presentation/features/terms-use/terms-use.routes').then((m) => m.TERMS_USE_ROUTES),
                data: {
                    title: 'CONTENT_MANAGEMENT.TERMS_USE.TITLE',
                    module: 'CONTENT_MANAGEMENT.LABEL',
                    subModule: 'CONTENT_MANAGEMENT.TERMS_USE.LABEL',
                },
            },
        ],
    },

    {
        path: LEGAL_NOTICE_ROUTE,
        children: [
            {
                path: '',
                loadChildren: () => import('./presentation/features/legal-notice/legal-notice.routes').then((m) => m.LEGAL_NOTICE_ROUTES),
                data: {
                    title: 'CONTENT_MANAGEMENT.LEGAL_NOTICE.TITLE',
                    module: 'CONTENT_MANAGEMENT.LABEL',
                    subModule: 'CONTENT_MANAGEMENT.LEGAL_NOTICE.LABEL',
                },
            },
        ],
    },
];
