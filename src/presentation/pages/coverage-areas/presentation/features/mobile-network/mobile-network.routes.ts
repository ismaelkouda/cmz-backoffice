import { Routes } from '@angular/router';

import {
    MOBILE_NETWORK_FORM,
    MOBILE_NETWORK_LIST,
    MOBILE_NETWORK_HISTORY,
} from '@pages/coverage-areas/presentation/features/mobile-network/mobile-network-paths.constants';

export const MOBILE_NETWORK_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('@pages/coverage-areas/presentation/features/mobile-network/mobile-network-page/mobile-network-page.component').then(
                (m) => m.MobileNetworkPageComponent
            ),
        data: {
            title: 'COVERAGE_AREAS.MOBILE_NETWORK.TITLE',
            breadcrumb: 'COVERAGE_AREAS.MOBILE_NETWORK.TITLE',
        },
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: MOBILE_NETWORK_LIST,
            },
            {
                path: MOBILE_NETWORK_LIST,
                loadComponent: () =>
                    import('@pages/coverage-areas/presentation/features/mobile-network/mobile-network-list/mobile-network-list.component').then(
                        (m) => m.MobileNetworkListComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
            {
                path: MOBILE_NETWORK_HISTORY,
                loadComponent: () =>
                    import('@shared/components/history/presentation/features/history-page/history-page.component').then(
                        (m) => m.HistoryPageComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
    {
        path: MOBILE_NETWORK_FORM,
        loadComponent: () =>
            import('@pages/coverage-areas/presentation/features/mobile-network/mobile-network-form/mobile-network-form.component').then(
                (m) => m.MobileNetworkFormComponent
            ),
        data: {
            title: 'COVERAGE_AREAS.MOBILE_NETWORK.FORM.TITLE',
            breadcrumb: 'COVERAGE_AREAS.MOBILE_NETWORK.FORM.TITLE',
        },
    },
];
