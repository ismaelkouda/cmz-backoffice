import { Routes } from '@angular/router';

export const SLA_THRESHOLDS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./sla-thresholds.component').then(
                (m) => m.SlaThresholdsComponent
            ),
        data: {
            title: 'SLA.THRESHOLDS.TITLE',
            breadcrumb: 'SLA.THRESHOLDS.TITLE',
        },
    },
];
