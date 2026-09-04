import { Routes } from '@angular/router';
import { authGuard } from '@core/guard/auth.guard';
import { privacyPolicyGuard } from '@core/guard/privacy-policy.guard';
import { unauthGuard } from '@core/guard/unauth.guard';
import { ContentComponent } from '@shared/components/layout/content/content.component';
import {
    content,
    DASHBOARD,
    PRIVACY_POLICY_ROUTE,
} from '@shared/routes/routes';

export const AUTH = 'auth';

export const routes = [
    {
        path: PRIVACY_POLICY_ROUTE,
        loadComponent: () =>
            import('@shared/components/privacy-policy-dialog/privacy-policy-page.component').then(
                (m) => m.PrivacyPolicyPageComponent
            ),
        canActivate: [privacyPolicyGuard],
    },
    {
        path: AUTH,
        loadChildren: (): Promise<Routes> =>
            import('@pages/authentication/authentication.routes').then(
                (m) => m.routes
            ),
        canActivate: [unauthGuard],
    },
    {
        path: '',
        component: ContentComponent,
        canActivate: [authGuard],
        children: content,
    },
    {
        path: '**',
        redirectTo: DASHBOARD,
        pathMatch: 'full' as const,
    },
];
