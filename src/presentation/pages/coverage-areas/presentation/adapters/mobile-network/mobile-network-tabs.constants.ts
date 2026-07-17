import {
    MOBILE_NETWORK_LIST,
    MOBILE_NETWORK_HISTORY,
    MOBILE_NETWORK_ROUTE,
} from '@pages/coverage-areas/presentation/features/mobile-network/mobile-network-paths.constants';
import { COVERAGE_AREAS_ROUTE } from '@shared/routes/routes';

export const MOBILE_NETWORK_TABS = [
    {
        value: '0',
        route: `/${COVERAGE_AREAS_ROUTE}/${MOBILE_NETWORK_ROUTE}/${MOBILE_NETWORK_LIST}`,
        label: 'COVERAGE_AREAS.MOBILE_NETWORK.TABS.MOBILE_NETWORK.LABEL',
        icon: 'pi pi-list',
    },
    {
        value: '1',
        route: `/${COVERAGE_AREAS_ROUTE}/${MOBILE_NETWORK_ROUTE}/${MOBILE_NETWORK_HISTORY}`,
        label: 'COVERAGE_AREAS.MOBILE_NETWORK.TABS.HISTORY.LABEL',
        icon: 'pi pi-history',
        queryParams: {
            ref: 'coverage-areas',
        },
    },
];
