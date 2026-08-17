import { HOME_ROUTE } from '@pages/content-management/content-management.routes';
import {
    HOME_LIST_ROUTE,
    HOME_HISTORY_ROUTE,
} from '@presentation/pages/content-management/presentation/features/home/home-paths.constants';
import { CONTENT_MANAGEMENT_ROUTE } from '@shared/routes/routes';

export const HOME_TABS = [
    {
        value: '0',
        route: `/${CONTENT_MANAGEMENT_ROUTE}/${HOME_ROUTE}/${HOME_LIST_ROUTE}`,
        label: 'CONTENT_MANAGEMENT.HOME.TABS.HOME.LABEL',
        icon: 'pi pi-list',
    },
    {
        value: '1',
        route: `/${CONTENT_MANAGEMENT_ROUTE}/${HOME_ROUTE}/${HOME_HISTORY_ROUTE}`,
        label: 'CONTENT_MANAGEMENT.HOME.TABS.HISTORY.LABEL',
        icon: 'pi pi-history',
        queryParams: { ref: 'home-block-info', module: 'content-management' },
    },
];
