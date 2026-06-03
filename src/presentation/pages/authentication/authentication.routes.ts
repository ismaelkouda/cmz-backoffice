import { Routes } from '@angular/router';

export const LOGIN = 'login';
export const PORTAIL = 'portail';

export const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: LOGIN,
                loadComponent: () =>
                    import('./presentation/ui/login/login.component').then(
                        (m) => m.LoginComponent
                    ),
            },
            {
                path: '',
                redirectTo: LOGIN,
                pathMatch: 'full',
            },
        ],
    },
];
