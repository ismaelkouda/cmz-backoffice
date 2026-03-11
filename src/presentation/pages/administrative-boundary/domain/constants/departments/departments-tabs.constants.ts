import { DEPARTMENTS_ROUTE } from '@pages/administrative-boundary/administrative-boundary.routes';
import { ADMINISTRATIVE_BOUNDARY_ROUTE } from '@shared/routes/routes';

export const DEPARTMENTS_TABS = [
    {
        value: '0',
        route: `/${ADMINISTRATIVE_BOUNDARY_ROUTE}/${DEPARTMENTS_ROUTE}`,
        label: 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.TABS.DEPARTMENTS.LABEL',
        icon: 'pi pi-list',
    },
    {
        value: '1',
        route: `/${ADMINISTRATIVE_BOUNDARY_ROUTE}/history`,
        label: 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.TABS.HISTORY.LABEL',
        icon: 'pi pi-history',
        queryParams: { participant: 'test' },
    },
];
