import { Routes } from '@angular/router';
import { TermsUseFormComponent } from '@pages/content-management/presentation/features/terms-use/terms-use-form/terms-use-form.component';
import {
    TERMS_USE_LIST_ROUTE,
    TERMS_USE_HISTORY_ROUTE,
    TERMS_USE_FORM_ROUTE,
} from '@pages/content-management/presentation/features/terms-use/terms-use-paths.constants';
import { TermsUseListComponent } from '@presentation/pages/content-management/presentation/features/terms-use/terms-use-list/terms-use-list.component';
import { TermsUsePageComponent } from '@presentation/pages/content-management/presentation/features/terms-use/terms-use-page/terms-use-page.component';
import { HistoryPageComponent } from '@shared/components/history/presentation/features/history-page/history-page.component';

export const TERMS_USE_ROUTES: Routes = [
    {
        path: '',
        component: TermsUsePageComponent,
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
                component: TermsUseListComponent,
                data: { breadcrumb: { hide: true } },
            },
            {
                path: TERMS_USE_HISTORY_ROUTE,
                component: HistoryPageComponent,
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
                component: TermsUseFormComponent,
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
];
