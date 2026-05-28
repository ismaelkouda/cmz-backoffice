import { Routes } from '@angular/router';

export const FORGOT_PASSWORD = 'forgot-password';
export const RESET_PASSWORD = 'reset-password';

export const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: FORGOT_PASSWORD,
                loadComponent: () =>
                    import('./ui/forgot-password/forgot-password.component').then(
                        (m) => m.ForgotPasswordComponent
                    ),
            },
            {
                path: RESET_PASSWORD,
                loadComponent: () =>
                    import('./ui/reset-password/reset-password.component').then(
                        (m) => m.ResetPasswordComponent
                    ),
            },
            {
                path: '',
                redirectTo: FORGOT_PASSWORD,
                pathMatch: 'full',
            },
        ],
    },
];
