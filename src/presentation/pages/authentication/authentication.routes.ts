import { Routes } from '@angular/router';
import { LoginComponent } from './ui/login/login.component';

export const LOGIN = 'login';
export const PORTAIL = 'portail';

export const routes: Routes = [
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
