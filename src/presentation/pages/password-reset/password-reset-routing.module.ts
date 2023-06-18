import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequetePasswordComponent } from './ui/requete-password/requete-password.component';
import { ConfirmPasswordComponent } from './ui/confirm-password/confirm-password.component';

export const REQUEST_PASSWORD = 'demande'
export const CONFIRM_RESET_PASSWORD = 'confirmation';


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: REQUEST_PASSWORD,
                component: RequetePasswordComponent
            },
            {
                path: CONFIRM_RESET_PASSWORD,
                component: ConfirmPasswordComponent
            }
        ]
    },
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PasswordResetRoutingModule { }
