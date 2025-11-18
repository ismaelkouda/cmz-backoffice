import { Routes } from '@angular/router';

export const AUTH = 'auth';
export const full: Routes = [
    {
        path: AUTH,
        loadChildren: () =>
            import(
                '../../presentation/pages/authentication/authentication.routes'
            ).then((m) => m.routes),
    },
];
