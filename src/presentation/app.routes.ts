import { AuthGuard } from '../core/guard/auth.guard';
import { GuestGuard } from '../core/guard/guest.guard';
import { ContentComponent } from '../shared/components/layout/content/content.component';
import { content, DASHBOARD } from '../shared/routes/routes';
import { AUTH, REINITIALIZATION } from './app-routing.module';

export const routes = [
    {
        path: AUTH,
        loadChildren: () =>
            import('./pages/authentication/authentication.module').then(
                (m) => m.AuthenticationModule
            ),
        canActivate: [GuestGuard],
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
        pathMatch: 'full' as const,
        canActivate: [AuthGuard],
    },
    {
        path: '',
        redirectTo: DASHBOARD,
        pathMatch: 'full' as const,
    },
];
