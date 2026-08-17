import { Routes } from '@angular/router';

import {
    INFRASTRUCTURE_FORM,
    INFRASTRUCTURE_LIST,
    INFRASTRUCTURE_HISTORY,
} from '@presentation/pages/administrative-infrastructure/presentation/features/infrastructure/infrastructure-paths.constants';

export const INFRASTRUCTURE_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('@presentation/pages/administrative-infrastructure/presentation/features/infrastructure/infrastructure-page/infrastructure-page.component').then(
                (m) => m.InfrastructurePageComponent
            ),
        data: {
            title: 'CONTENT_MANAGEMENT.INFRASTRUCTURE.TITLE',
            breadcrumb: 'CONTENT_MANAGEMENT.INFRASTRUCTURE.TITLE',
        },
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: INFRASTRUCTURE_LIST,
            },
            {
                path: INFRASTRUCTURE_LIST,
                loadComponent: () =>
                    import('@presentation/pages/administrative-infrastructure/presentation/features/infrastructure/infrastructure-list/infrastructure-list.component').then(
                        (m) => m.InfrastructureListComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
            {
                path: INFRASTRUCTURE_HISTORY,
                loadComponent: () =>
                    import('@shared/components/history/presentation/features/history-page/history-page.component').then(
                        (m) => m.HistoryPageComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
    {
        path: INFRASTRUCTURE_FORM,
        loadComponent: () =>
            import('@presentation/pages/administrative-infrastructure/presentation/features/infrastructure/infrastructure-form/infrastructure-form.component').then(
                (m) => m.InfrastructureFormComponent
            ),
        data: {
            title: 'CONTENT_MANAGEMENT.INFRASTRUCTURE.FORM.TITLE',
            breadcrumb: 'CONTENT_MANAGEMENT.INFRASTRUCTURE.FORM.TITLE',
        },
    },
];
