import {
    INFRASTRUCTURE_TYPE_LIST,
    INFRASTRUCTURE_TYPE_HISTORY,
    INFRASTRUCTURE_TYPE_ROUTE,
} from '@presentation/pages/administrative-infrastructure/presentation/features/infrastructure-type/infrastructure-type-paths.constants';
import { ADMINISTRATIVE_INFRASTRUCTURE_ROUTE } from '@shared/routes/routes';

export const ADMINISTRATIVE_TYPE_TABS = [
    {
        value: '0',
        route: `/${ADMINISTRATIVE_INFRASTRUCTURE_ROUTE}/${INFRASTRUCTURE_TYPE_ROUTE}/${INFRASTRUCTURE_TYPE_LIST}`,
        label: 'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE_TYPE.TABS.INFRASTRUCTURE_TYPE.LABEL',
        icon: 'pi pi-list',
    },
    {
        value: '1',
        route: `/${ADMINISTRATIVE_INFRASTRUCTURE_ROUTE}/${INFRASTRUCTURE_TYPE_ROUTE}/${INFRASTRUCTURE_TYPE_HISTORY}`,
        label: 'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE_TYPE.TABS.HISTORY.LABEL',
        icon: 'pi pi-history',
        queryParams: {
            ref: 'equipment-types',
        },
    },
];
