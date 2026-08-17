import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./presentation/dahsboard-page/dashboard-page.component').then(
                (m) => m.DashboardPageComponent
            ),
    },
];
