import { Routes } from '@angular/router';
import {
    OPTICAL_FIBER_NETWORK_FORM,
    OPTICAL_FIBER_NETWORK_LIST,
    OPTICAL_FIBER_NETWORK_HISTORY,
} from '@pages/coverage-areas/presentation/features/optical-fiber-network/optical-fiber-network-paths.constants';

export const OPTICAL_FIBER_NETWORK_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('@pages/coverage-areas/presentation/features/optical-fiber-network/optical-fiber-network-page/optical-fiber-network-page.component').then(
                (m) => m.OpticalFiberNetworkPageComponent
            ),
        data: {
            title: 'COVERAGE_AREAS.OPTICAL_FIBER_NETWORK.TITLE',
            breadcrumb: 'COVERAGE_AREAS.OPTICAL_FIBER_NETWORK.TITLE',
        },
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: OPTICAL_FIBER_NETWORK_LIST,
            },
            {
                path: OPTICAL_FIBER_NETWORK_LIST,
                loadComponent: () =>
                    import('@pages/coverage-areas/presentation/features/optical-fiber-network/optical-fiber-network-list/optical-fiber-network-list.component').then(
                        (m) => m.OpticalFiberNetworkListComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
            {
                path: OPTICAL_FIBER_NETWORK_HISTORY,
                loadComponent: () =>
                    import('@shared/components/history/presentation/features/history-page/history-page.component').then(
                        (m) => m.HistoryPageComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
    {
        path: OPTICAL_FIBER_NETWORK_FORM,
        loadComponent: () =>
            import('@pages/coverage-areas/presentation/features/optical-fiber-network/optical-fiber-network-form/optical-fiber-network-form.component').then(
                (m) => m.OpticalFiberNetworkFormComponent
            ),
        data: {
            title: 'COVERAGE_AREAS.OPTICAL_FIBER_NETWORK.FORM.TITLE',
            breadcrumb: 'COVERAGE_AREAS.OPTICAL_FIBER_NETWORK.FORM.TITLE',
        },
    },
];
