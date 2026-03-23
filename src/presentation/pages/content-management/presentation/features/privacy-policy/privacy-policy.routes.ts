import { Routes } from '@angular/router';
import { PrivacyPolicyFormComponent } from '@pages/content-management/presentation/features/privacy-policy/privacy-policy-form/privacy-policy-form.component';
import { PrivacyPolicyPageComponent } from '@pages/content-management/presentation/features/privacy-policy/privacy-policy-page/privacy-policy-page.component';

export const PRIVACY_POLICY_FORM = 'form';

export const PRIVACY_POLICY_ROUTES: Routes = [
    {
        path: '',
        data: {
            title: 'CONTENT_MANAGEMENT.PRIVACY_POLICY.TITLE',
            breadcrumb: 'CONTENT_MANAGEMENT.PRIVACY_POLICY.TITLE',
        },
        children: [
            {
                path: '',
                component: PrivacyPolicyPageComponent,
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
    {
        path: `${PRIVACY_POLICY_FORM}`,
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
