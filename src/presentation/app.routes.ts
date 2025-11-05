import { authGuard } from '../core/guard/auth.guard';
import { ContentComponent } from '../shared/components/layout/content/content.component';
import { content, DASHBOARD } from '../shared/routes/routes';

export const REINITIALIZATION = 'reinitialisation';
export const AUTH = 'auth';

export const routes = [
    {
        path: AUTH,
        loadChildren: () =>
            import('./pages/authentication/authentication.module').then(
                (m) => m.AuthenticationModule
            ),
    },
    {
        path: REINITIALIZATION,
        loadChildren: () =>
            import('./pages/password-reset/password-reset.module').then(
                (m) => m.PasswordResetModule
            ),
    },
    {
        path: '',
        component: ContentComponent,
        children: content,
        canActivate: [authGuard]
    },
    {
        path: '**',
        redirectTo: DASHBOARD,
        pathMatch: 'full' as const,
    }
];