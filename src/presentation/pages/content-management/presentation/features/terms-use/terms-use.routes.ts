import { Routes } from '@angular/router';

import {
    TERMS_USE_LIST_ROUTE,
    TERMS_USE_HISTORY_ROUTE,
    TERMS_USE_FORM_ROUTE,
} from '@pages/content-management/presentation/features/terms-use/terms-use-paths.constants';

export const TERMS_USE_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('@presentation/pages/content-management/presentation/features/terms-use/terms-use-page/terms-use-page.component').then(
                (m) => m.TermsUsePageComponent
            ),
        data: {
            title: 'CONT ENT_MANAGEMENT.TERMS_USE.TITLE',
            breadcrumb: 'CONTENT_MANAGEMENT.TERMS_USE.TITLE',
        },
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: TERMS_USE_LIST_ROUTE,
            },
            {
                path: TERMS_USE_LIST_ROUTE,
                loadComponent: () =>
                    import('@presentation/pages/content-management/presentation/features/terms-use/terms-use-list/terms-use-list.component').then(
                        (m) => m.TermsUseListComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
            {
                path: TERMS_USE_HISTORY_ROUTE,
                loadComponent: () =>
                    import('@shared/components/history/presentation/features/history-page/history-page.component').then(
                        (m) => m.HistoryPageComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
    {
        path: `${TERMS_USE_FORM_ROUTE}`,
        data: {
            title: 'CONTENT_MANAGEMENT.TERMS_USE.FORM.TITLE',
            breadcrumb: 'CONTENT_MANAGEMENT.TERMS_USE.FORM.TITLE',
        },
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('@pages/content-management/presentation/features/terms-use/terms-use-form/terms-use-form.component').then(
                        (m) => m.TermsUseFormComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
];
