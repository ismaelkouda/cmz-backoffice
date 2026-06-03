import { Routes } from '@angular/router';
import { LOGIN_ROUTE } from '@presentation/pages/authentication/presentation/constants/login/login-routes.constant';
import { FORGOT_PASSWORD_ROUTE } from '@presentation/pages/authentication/presentation/constants/forgot-password/forgot-password-routes.constant';
import { RESET_PASSWORD_ROUTE } from '@presentation/pages/authentication/presentation/constants/reset-password/reset-password-routes.constant';

export const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: LOGIN_ROUTE,
                loadComponent: () =>
                    import('./presentation/ui/login/login.component').then(
                        (m) => m.LoginComponent
                    ),
            },
            {
                path: FORGOT_PASSWORD_ROUTE,
                loadComponent: () =>
                    import('./presentation/ui/forgot-password/forgot-password.component').then(
                        (m) => m.ForgotPasswordComponent
                    ),
            },
            {
                path: RESET_PASSWORD_ROUTE,
                loadComponent: () =>
                    import('./presentation/ui/reset-password/reset-password.component').then(
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
