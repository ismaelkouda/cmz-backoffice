import {
    OPTICAL_FIBER_NETWORK_LIST,
    OPTICAL_FIBER_NETWORK_HISTORY,
    OPTICAL_FIBER_NETWORK_ROUTE,
} from '@pages/coverage-areas/presentation/features/optical-fiber-network/optical-fiber-network-paths.constants';
import { COVERAGE_AREAS_ROUTE } from '@shared/routes/routes';

export const OPTICAL_FIBER_NETWORK_TABS = [
    {
        value: '0',
        route: `/${COVERAGE_AREAS_ROUTE}/${OPTICAL_FIBER_NETWORK_ROUTE}/${OPTICAL_FIBER_NETWORK_LIST}`,
        label: 'COVERAGE_AREAS.OPTICAL_FIBER_NETWORK.TABS.OPTICAL_FIBER_NETWORK.LABEL',
        icon: 'pi pi-list',
    },
    {
        value: '1',
        route: `/${COVERAGE_AREAS_ROUTE}/${OPTICAL_FIBER_NETWORK_ROUTE}/${OPTICAL_FIBER_NETWORK_HISTORY}`,
        label: 'COVERAGE_AREAS.OPTICAL_FIBER_NETWORK.TABS.HISTORY.LABEL',
        icon: 'pi pi-history',
        queryParams: { ref: 'coverage-areas' },
    },
];
