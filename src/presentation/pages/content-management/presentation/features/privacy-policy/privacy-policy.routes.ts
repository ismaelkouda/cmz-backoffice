import { Routes } from '@angular/router';

import {
    PRIVACY_POLICY_LIST_ROUTE,
    PRIVACY_POLICY_HISTORY_ROUTE,
    PRIVACY_POLICY_FORM_ROUTE,
} from '@pages/content-management/presentation/features/privacy-policy/privacy-policy-paths.constants';

export const PRIVACY_POLICY_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('@pages/content-management/presentation/features/privacy-policy/privacy-policy-page/privacy-policy-page.component').then(
                (m) => m.PrivacyPolicyPageComponent
            ),
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
                loadComponent: () =>
                    import('@presentation/pages/content-management/presentation/features/privacy-policy/privacy-policy-list/privacy-policy-list.component').then(
                        (m) => m.PrivacyPolicyListComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
            {
                path: PRIVACY_POLICY_HISTORY_ROUTE,
                loadComponent: () =>
                    import('@shared/components/history/presentation/features/history-page/history-page.component').then(
                        (m) => m.HistoryPageComponent
                    ),
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
                loadComponent: () =>
                    import('@pages/content-management/presentation/features/privacy-policy/privacy-policy-form/privacy-policy-form.component').then(
                        (m) => m.PrivacyPolicyFormComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
];
