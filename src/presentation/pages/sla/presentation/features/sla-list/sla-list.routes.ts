import { Routes } from '@angular/router';

export const SLA_LIST_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./sla-list.component').then((m) => m.SlaListComponent),
        data: {
            title: 'SLA.SLA_LIST.TITLE',
            breadcrumb: 'SLA.SLA_LIST.TITLE',
        },
    },
];
