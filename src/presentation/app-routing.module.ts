import { content, DASHBOARD } from './../shared/routes/routes';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuestGuard } from '../core/guard/guest.guard';
import { AuthGuard } from '../core/guard/auth.guard';
import { ContentComponent } from '../shared/components/layout/content/content.component';
// import { NotFoundComponent } from './pages/not-found/not-found.component';

export const REINITIALIZATION = 'reinitialisation';
export const AUTH = 'auth';

const routes: Routes = [
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
            import(
                '../presentation/pages/password-reset/password-reset.module'
            ).then((m) => m.PasswordResetModule),
    },
    {
        path: '',
        component: ContentComponent,
        children: content,
        canActivate: [AuthGuard],
    },
    {
        path: '',
        redirectTo: DASHBOARD,
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [
        [
            RouterModule.forRoot(routes, {
                anchorScrolling: 'enabled',
                scrollPositionRestoration: 'enabled',
            }),
        ],
    ],
})
export class AppRoutingModule {}
