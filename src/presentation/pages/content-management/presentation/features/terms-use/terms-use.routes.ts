import { Routes } from '@angular/router';
import { TermsUseFormComponent } from '@pages/content-management/presentation/features/terms-use/terms-use-form/terms-use-form.component';
import { TermsUsePageComponent } from '@pages/content-management/presentation/features/terms-use/terms-use-page/terms-use-page.component';

export const TERMS_USE_FORM = 'form';

export const TERMS_USE_ROUTES: Routes = [
    {
        path: '',
        data: {
            title: 'CONTENT_MANAGEMENT.TERMS_USE.TITLE',
            breadcrumb: 'CONTENT_MANAGEMENT.TERMS_USE.TITLE',
        },
        children: [
            {
                path: '',
                component: TermsUsePageComponent,
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
    {
        path: `${TERMS_USE_FORM}`,
        data: {
            title: 'CONTENT_MANAGEMENT.TERMS_USE.FORM.TITLE',
            breadcrumb: 'CONTENT_MANAGEMENT.TERMS_USE.FORM.TITLE',
        },
        children: [
            {
                path: '',
                component: TermsUseFormComponent,
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
];
