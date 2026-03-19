import { Routes } from '@angular/router';
import { LegalNoticeFormComponent } from '@pages/content-management/presentation/features/legal-notice/legal-notice-form/legal-notice-form.component';
import { LegalNoticePageComponent } from '@pages/content-management/presentation/features/legal-notice/legal-notice-page/legal-notice-page.component';

export const LEGAL_NOTICE_FORM = 'form';

export const LEGAL_NOTICE_ROUTES: Routes = [
    {
        path: '',
        data: {
            title: 'CONTENT_MANAGEMENT.LEGAL_NOTICE.TITLE',
            breadcrumb: 'CONTENT_MANAGEMENT.LEGAL_NOTICE.TITLE',
        },
        children: [
            {
                path: '',
                component: LegalNoticePageComponent,
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
    {
        path: `${LEGAL_NOTICE_FORM}`,
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
