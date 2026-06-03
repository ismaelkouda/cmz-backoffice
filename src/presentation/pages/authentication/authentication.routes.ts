import { Routes } from '@angular/router';
import { LOGIN_ROUTE } from '@presentation/pages/authentication/presentation/constants/login-routes.constant';

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
                path: '',
                redirectTo: LOGIN_ROUTE,
                pathMatch: 'full',
            },
        ],
    },
];
