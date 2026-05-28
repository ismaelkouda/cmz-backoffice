import { TERMS_USE_ROUTE } from '@pages/content-management/content-management.routes';
import {
    TERMS_USE_LIST_ROUTE,
    TERMS_USE_HISTORY_ROUTE,
} from '@presentation/pages/content-management/presentation/features/terms-use/terms-use-paths.constants';
import { CONTENT_MANAGEMENT_ROUTE } from '@shared/routes/routes';

export const TERMS_USE_TABS = [
    {
        value: '0',
        route: `/${CONTENT_MANAGEMENT_ROUTE}/${TERMS_USE_ROUTE}/${TERMS_USE_LIST_ROUTE}`,
        label: 'CONTENT_MANAGEMENT.TERMS_USE.TABS.TERMS_USE.LABEL',
        icon: 'pi pi-list',
    },
    {
        value: '1',
        route: `/${CONTENT_MANAGEMENT_ROUTE}/${TERMS_USE_ROUTE}/${TERMS_USE_HISTORY_ROUTE}`,
        label: 'CONTENT_MANAGEMENT.TERMS_USE.TABS.HISTORY.LABEL',
        icon: 'pi pi-history',
        queryParams: { ref: 'terms-use', module: 'content-management' },
    },
];
