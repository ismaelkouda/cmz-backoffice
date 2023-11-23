import { ForgotPasswordComponent } from './ui/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './ui/reset-password/reset-password.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const FORGOT_PASSWORD = 'forgot-password'
export const RESET_PASSWORD = 'reset-password'


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: FORGOT_PASSWORD,
                component: ForgotPasswordComponent
            },
            {
                path: `${RESET_PASSWORD}`,
                component: ResetPasswordComponent
            }
        ]
    },
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PasswordResetRoutingModule { }
