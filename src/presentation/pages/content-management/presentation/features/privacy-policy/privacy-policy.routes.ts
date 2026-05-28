import { Routes } from '@angular/router';
import { PrivacyPolicyFormComponent } from '@pages/content-management/presentation/features/privacy-policy/privacy-policy-form/privacy-policy-form.component';
import { PrivacyPolicyPageComponent } from '@pages/content-management/presentation/features/privacy-policy/privacy-policy-page/privacy-policy-page.component';
import {
    PRIVACY_POLICY_LIST_ROUTE,
    PRIVACY_POLICY_HISTORY_ROUTE,
    PRIVACY_POLICY_FORM_ROUTE,
} from '@pages/content-management/presentation/features/privacy-policy/privacy-policy-paths.constants';
import { PrivacyPolicyListComponent } from '@presentation/pages/content-management/presentation/features/privacy-policy/privacy-policy-list/privacy-policy-list.component';
import { HistoryPageComponent } from '@shared/components/history/presentation/features/history-page/history-page.component';

export const PRIVACY_POLICY_ROUTES: Routes = [
    {
        path: '',
        component: PrivacyPolicyPageComponent,
        data: {
            title: 'CONTENT_MANAGEMENT.PRIVACY_POLICY.TITLE',
            breadcrumb: 'CONTENT_MANAGEMENT.PRIVACY_POLICY.TITLE',
        },
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: PRIVACY_POLICY_LIST_ROUTE,
            },
            {
                path: PRIVACY_POLICY_LIST_ROUTE,
                component: PrivacyPolicyListComponent,
                data: { breadcrumb: { hide: true } },
            },
            {
                path: PRIVACY_POLICY_HISTORY_ROUTE,
                component: HistoryPageComponent,
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
    {
        path: `${PRIVACY_POLICY_FORM_ROUTE}`,
        data: {
            title: 'CONTENT_MANAGEMENT.PRIVACY_POLICY.FORM.TITLE',
            breadcrumb: 'CONTENT_MANAGEMENT.PRIVACY_POLICY.FORM.TITLE',
        },
        children: [
            {
                path: '',
                component: PrivacyPolicyFormComponent,
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
];
