import { MUNICIPALITIES_ROUTE } from '@pages/administrative-boundary/administrative-boundary.routes';
import {
    MUNICIPALITIES_LIST_ROUTE,
    MUNICIPALITIES_HISTORY_ROUTE,
} from '@pages/administrative-boundary/presentation/municipalities/municipalities-paths.constants';
import { ADMINISTRATIVE_BOUNDARY_ROUTE } from '@shared/routes/routes';

export const MUNICIPALITIES_TABS = [
    {
        value: '0',
        route: `/${ADMINISTRATIVE_BOUNDARY_ROUTE}/${MUNICIPALITIES_ROUTE}/${MUNICIPALITIES_LIST_ROUTE}`,
        label: 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.TABS.MUNICIPALITIES.LABEL',
        icon: 'pi pi-list',
    },
    {
        value: '1',
        route: `/${ADMINISTRATIVE_BOUNDARY_ROUTE}/${MUNICIPALITIES_ROUTE}/${MUNICIPALITIES_HISTORY_ROUTE}`,
        label: 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.TABS.HISTORY.LABEL',
        icon: 'pi pi-history',
        queryParams: { ref: 'municipality', module: 'territorial-structure' },
    },
];
