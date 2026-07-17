import { Routes } from '@angular/router';
import { LOGIN_ROUTE } from '@presentation/pages/authentication/presentation/features/login/login-routes.constant';
import { FORGOT_PASSWORD_ROUTE } from '@presentation/pages/authentication/presentation/features/forgot-password/forgot-password-routes.constant';
import { RESET_PASSWORD_ROUTE } from '@presentation/pages/authentication/presentation/features/reset-password/reset-password-routes.constant';

export const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: LOGIN_ROUTE,
                loadComponent: () =>
                    import('./presentation/features/login/login.component').then(
                        (m) => m.LoginComponent
                    ),
            },
            {
                path: FORGOT_PASSWORD_ROUTE,
                loadComponent: () =>
                    import('./presentation/features/forgot-password/forgot-password.component').then(
                        (m) => m.ForgotPasswordComponent
                    ),
            },
            {
                path: RESET_PASSWORD_ROUTE,
                loadComponent: () =>
                    import('./presentation/features/reset-password/reset-password.component').then(
                        (m) => m.ResetPasswordComponent
                    ),
            },
            {
                path: '',
                redirectTo: LOGIN_ROUTE,
                pathMatch: 'full',
            },
        ],
    },
];
