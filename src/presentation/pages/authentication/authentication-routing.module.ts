import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './ui/login/login.component';

export const LOGIN = 'login';
export const PORTAIL = 'portail';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: LOGIN,
                component: LoginComponent,
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
