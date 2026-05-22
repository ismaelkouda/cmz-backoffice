import { Routes } from '@angular/router';
import { LegalNoticeFormComponent } from '@pages/content-management/presentation/features/legal-notice/legal-notice-form/legal-notice-form.component';
import {
    LEGAL_NOTICE_LIST_ROUTE,
    LEGAL_NOTICE_HISTORY_ROUTE,
    LEGAL_NOTICE_FORM_ROUTE,
} from '@pages/content-management/presentation/features/legal-notice/legal-notice-paths.constants';
import { LegalNoticeListComponent } from '@presentation/pages/content-management/presentation/features/legal-notice/legal-notice-list/legal-notice-list.component';
import { LegalNoticePageComponent } from '@presentation/pages/content-management/presentation/features/legal-notice/legal-notice-page/legal-notice-page.component';
import { HistoryPageComponent } from '@shared/components/history/presentation/features/history-page/history-page.component';

export const LEGAL_NOTICE_ROUTES: Routes = [
    {
        path: '',
        component: LegalNoticePageComponent,
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
                component: LegalNoticeListComponent,
                data: { breadcrumb: { hide: true } },
            },
            {
                path: LEGAL_NOTICE_HISTORY_ROUTE,
                component: HistoryPageComponent,
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
                component: LegalNoticeFormComponent,
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
];
