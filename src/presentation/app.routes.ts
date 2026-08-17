import { Routes } from '@angular/router';
import { authGuard } from '@core/guard/auth.guard';
import { unauthGuard } from '@core/guard/unauth.guard';
import { ContentComponent } from '@shared/components/layout/content/content.component';
import { content, DASHBOARD } from '@shared/routes/routes';

export const REINITIALIZATION = 'reinitialisation';
export const AUTH = 'auth';

export const routes = [
    {
        path: AUTH,
        loadChildren: (): Promise<Routes> =>
            import('@pages/authentication/authentication.routes').then(
                (m) => m.routes
            ),
        canActivate: [unauthGuard],
    },
    {
        path: REINITIALIZATION,
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
