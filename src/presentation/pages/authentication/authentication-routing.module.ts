import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './ui/login/login.component';
import { AuthGuard } from '../../../core/guard/auth.guard';
import { GuestGuard } from '../../../core/guard/guest.guard';

export const LOGIN = 'login';
export const PORTAIL = 'portail';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: LOGIN,
                component: LoginComponent,
                canActivate: [GuestGuard],
            },
            {
                path: '',
                redirectTo: LOGIN,
                pathMatch: 'full',
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AuthenticationRoutingModule {}
