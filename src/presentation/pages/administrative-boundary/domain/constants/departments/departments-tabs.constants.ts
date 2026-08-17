import { DEPARTMENTS_ROUTE } from '@pages/administrative-boundary/administrative-boundary.routes';
import {
    DEPARTMENTS_LIST_ROUTE,
    DEPARTMENTS_HISTORY_ROUTE,
} from '@pages/administrative-boundary/presentation/departments/departments-paths.constants';
import { ADMINISTRATIVE_BOUNDARY_ROUTE } from '@shared/routes/routes';

export const DEPARTMENTS_TABS = [
    {
        value: '0',
        route: `/${ADMINISTRATIVE_BOUNDARY_ROUTE}/${DEPARTMENTS_ROUTE}/${DEPARTMENTS_LIST_ROUTE}`,
        label: 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.TABS.DEPARTMENTS.LABEL',
        icon: 'pi pi-list',
    },
    {
        value: '1',
        route: `/${ADMINISTRATIVE_BOUNDARY_ROUTE}/${DEPARTMENTS_ROUTE}/${DEPARTMENTS_HISTORY_ROUTE}`,
        label: 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.TABS.HISTORY.LABEL',
        icon: 'pi pi-history',
        queryParams: { ref: 'department', module: 'territorial-structure' },
    },
];
