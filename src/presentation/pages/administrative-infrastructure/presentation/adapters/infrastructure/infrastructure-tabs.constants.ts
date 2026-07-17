import {
    INFRASTRUCTURE_LIST,
    INFRASTRUCTURE_HISTORY,
    INFRASTRUCTURE_ROUTE,
} from '@presentation/pages/administrative-infrastructure/presentation/features/infrastructure/infrastructure-paths.constants';
import { ADMINISTRATIVE_INFRASTRUCTURE_ROUTE } from '@shared/routes/routes';

export const ADMINISTRATIVE_TABS = [
    {
        value: '0',
        route: `/${ADMINISTRATIVE_INFRASTRUCTURE_ROUTE}/${INFRASTRUCTURE_ROUTE}/${INFRASTRUCTURE_LIST}`,
        label: 'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE.TABS.INFRASTRUCTURE.LABEL',
        icon: 'pi pi-list',
    },
    {
        value: '1',
        route: `/${ADMINISTRATIVE_INFRASTRUCTURE_ROUTE}/${INFRASTRUCTURE_ROUTE}/${INFRASTRUCTURE_HISTORY}`,
        label: 'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE.TABS.HISTORY.LABEL',
        icon: 'pi pi-history',
        queryParams: {
            ref: 'equipments',
        },
    },
];
