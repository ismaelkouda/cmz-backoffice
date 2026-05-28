import { Routes } from '@angular/router';

import {
    LEGAL_NOTICE_LIST_ROUTE,
    LEGAL_NOTICE_HISTORY_ROUTE,
    LEGAL_NOTICE_FORM_ROUTE,
} from '@pages/content-management/presentation/features/legal-notice/legal-notice-paths.constants';

export const LEGAL_NOTICE_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('@presentation/pages/content-management/presentation/features/legal-notice/legal-notice-page/legal-notice-page.component').then(
                (m) => m.LegalNoticePageComponent
            ),
        data: {
            title: 'CONTENT_MANAGEMENT.LEGAL_NOTICE.TITLE',
            breadcrumb: 'CONTENT_MANAGEMENT.LEGAL_NOTICE.TITLE',
        },
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: LEGAL_NOTICE_LIST_ROUTE,
            },
            {
                path: LEGAL_NOTICE_LIST_ROUTE,
                loadComponent: () =>
                    import('@presentation/pages/content-management/presentation/features/legal-notice/legal-notice-list/legal-notice-list.component').then(
                        (m) => m.LegalNoticeListComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
            {
                path: LEGAL_NOTICE_HISTORY_ROUTE,
                loadComponent: () =>
                    import('@shared/components/history/presentation/features/history-page/history-page.component').then(
                        (m) => m.HistoryPageComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
    {
        path: `${LEGAL_NOTICE_FORM_ROUTE}`,
        data: {
            title: 'CONTENT_MANAGEMENT.LEGAL_NOTICE.FORM.TITLE',
            breadcrumb: 'CONTENT_MANAGEMENT.LEGAL_NOTICE.FORM.TITLE',
        },
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('@pages/content-management/presentation/features/legal-notice/legal-notice-form/legal-notice-form.component').then(
                        (m) => m.LegalNoticeFormComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
];
