import { REGIONS_ROUTE } from '@pages/administrative-boundary/administrative-boundary.routes';
import {
    REGIONS_LIST_ROUTE,
    REGIONS_HISTORY_ROUTE,
} from '@presentation/pages/administrative-boundary/presentation/regions/regions-paths.constants';
import { ADMINISTRATIVE_BOUNDARY_ROUTE } from '@shared/routes/routes';

export const REGIONS_TABS = [
    {
        value: '0',
        route: `/${ADMINISTRATIVE_BOUNDARY_ROUTE}/${REGIONS_ROUTE}/${REGIONS_LIST_ROUTE}`,
        label: 'ADMINISTRATIVE_BOUNDARY.REGIONS.TABS.REGIONS.LABEL',
        icon: 'pi pi-list',
    },
    {
        value: '1',
        route: `/${ADMINISTRATIVE_BOUNDARY_ROUTE}/${REGIONS_ROUTE}/${REGIONS_HISTORY_ROUTE}`,
        label: 'ADMINISTRATIVE_BOUNDARY.REGIONS.TABS.HISTORY.LABEL',
        icon: 'pi pi-history',
        queryParams: { ref: 'region', module: 'territorial-structure' },
    },
];
