import { Routes } from '@angular/router';
import { INFRASTRUCTURE_TYPE_ROUTE } from '@presentation/pages/administrative-infrastructure/presentation/features/infrastructure-type/infrastructure-type-paths.constants';
import { INFRASTRUCTURE_ROUTE } from '@presentation/pages/administrative-infrastructure/presentation/features/infrastructure/infrastructure-paths.constants';

export const routes: Routes = [
    {
        path: INFRASTRUCTURE_TYPE_ROUTE,
        data: {
            breadcrumb: {
                label: 'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE_TYPE.BREADCRUMB.LABEL',
                icon: 'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE_TYPE.BREADCRUMB.ICON',
            },
        },
        children: [
            {
                path: '',
                loadChildren: () =>
                    import('@presentation/pages/administrative-infrastructure/presentation/features/infrastructure-type/infrastructure-type.routes').then(
                        (m) => m.INFRASTRUCTURE_TYPE_ROUTES
                    ),
                data: { breadcrumb: { hide: true } },
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
    },
    {
        path: INFRASTRUCTURE_ROUTE,
        data: {
            breadcrumb: {
                label: 'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE.BREADCRUMB.LABEL',
                icon: 'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE.BREADCRUMB.ICON',
            },
        },
        children: [
            {
                path: '',
                loadChildren: () =>
                    import('@presentation/pages/administrative-infrastructure/presentation/features/infrastructure/infrastructure.routes').then(
                        (m) => m.INFRASTRUCTURE_ROUTES
                    ),
                data: { breadcrumb: { hide: true } },
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
    },
];
