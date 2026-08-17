import { Routes } from '@angular/router';

import {
    INFRASTRUCTURE_TYPE_FORM,
    INFRASTRUCTURE_TYPE_LIST,
    INFRASTRUCTURE_TYPE_HISTORY,
} from '@presentation/pages/administrative-infrastructure/presentation/features/infrastructure-type/infrastructure-type-paths.constants';

export const INFRASTRUCTURE_TYPE_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('@presentation/pages/administrative-infrastructure/presentation/features/infrastructure-type/infrastructure-type-page/infrastructure-type-page.component').then(
                (m) => m.InfrastructureTypePageComponent
            ),
        data: {
            title: 'CONTENT_MANAGEMENT.INFRASTRUCTURE_TYPE.TITLE',
            breadcrumb: 'CONTENT_MANAGEMENT.INFRASTRUCTURE_TYPE.TITLE',
        },
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: INFRASTRUCTURE_TYPE_LIST,
            },
            {
                path: INFRASTRUCTURE_TYPE_LIST,
                loadComponent: () =>
                    import('@presentation/pages/administrative-infrastructure/presentation/features/infrastructure-type/infrastructure-type-list/infrastructure-type-list.component').then(
                        (m) => m.InfrastructureTypeListComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
            {
                path: INFRASTRUCTURE_TYPE_HISTORY,
                loadComponent: () =>
                    import('@shared/components/history/presentation/features/history-page/history-page.component').then(
                        (m) => m.HistoryPageComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
    {
        path: INFRASTRUCTURE_TYPE_FORM,
        loadComponent: () =>
            import('@presentation/pages/administrative-infrastructure/presentation/features/infrastructure-type/infrastructure-type-form/infrastructure-type-form.component').then(
                (m) => m.InfrastructureTypeFormComponent
            ),
        data: {
            title: 'CONTENT_MANAGEMENT.INFRASTRUCTURE_TYPE.FORM.TITLE',
            breadcrumb: 'CONTENT_MANAGEMENT.INFRASTRUCTURE_TYPE.FORM.TITLE',
        },
    },
];
