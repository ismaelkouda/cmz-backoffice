import { Routes } from '@angular/router';
import { SITE_GROUP_ROUTE } from '@pages/coverage-areas/presentation/features/site-group/site-group-paths.constants';
import { MOBILE_NETWORK_ROUTE } from '@pages/coverage-areas/presentation/features/mobile-network/mobile-network-paths.constants';

export const routes: Routes = [
    {
        path: SITE_GROUP_ROUTE,
        data: {
            breadcrumb: {
                label: 'COVERAGE_AREAS.SITE_GROUP.BREADCRUMB.LABEL',
                icon: 'COVERAGE_AREAS.SITE_GROUP.BREADCRUMB.ICON',
            },
        },
        children: [
            {
                path: '',
                loadChildren: () =>
                    import('@pages/coverage-areas/presentation/features/site-group/site-group.routes').then(
                        (m) => m.SITE_GROUP_ROUTES
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
        path: MOBILE_NETWORK_ROUTE,
        data: {
            breadcrumb: {
                label: 'COVERAGE_AREAS.MOBILE_NETWORK.BREADCRUMB.LABEL',
                icon: 'COVERAGE_AREAS.MOBILE_NETWORK.BREADCRUMB.ICON',
            },
        },
        children: [
            {
                path: '',
                loadChildren: () =>
                    import('@pages/coverage-areas/presentation/features/mobile-network/mobile-network.routes').then(
                        (m) => m.MOBILE_NETWORK_ROUTES
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
