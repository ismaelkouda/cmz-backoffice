import { Routes } from '@angular/router';
import { ForgotPasswordComponent } from './ui/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './ui/reset-password/reset-password.component';

export const FORGOT_PASSWORD = 'forgot-password';
export const RESET_PASSWORD = 'reset-password';

export const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: FORGOT_PASSWORD,
                component: ForgotPasswordComponent,
            },
            {
                path: RESET_PASSWORD,
                component: ResetPasswordComponent,
            },
            {
                path: '',
                redirectTo: FORGOT_PASSWORD,
                pathMatch: 'full',
            },
        ],
    },
];
