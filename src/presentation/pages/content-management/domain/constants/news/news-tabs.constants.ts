import { NEWS_ROUTE } from '@pages/content-management/content-management.routes';
import {
    NEWS_LIST_ROUTE,
    NEWS_HISTORY_ROUTE,
} from '@presentation/pages/content-management/presentation/features/news/news-paths.constants';
import { CONTENT_MANAGEMENT_ROUTE } from '@shared/routes/routes';

export const NEWS_TABS = [
    {
        value: '0',
        route: `/${CONTENT_MANAGEMENT_ROUTE}/${NEWS_ROUTE}/${NEWS_LIST_ROUTE}`,
        label: 'CONTENT_MANAGEMENT.NEWS.TABS.NEWS.LABEL',
        icon: 'pi pi-list',
    },
    {
        value: '1',
        route: `/${CONTENT_MANAGEMENT_ROUTE}/${NEWS_ROUTE}/${NEWS_HISTORY_ROUTE}`,
        label: 'CONTENT_MANAGEMENT.NEWS.TABS.HISTORY.LABEL',
        icon: 'pi pi-history',
        queryParams: { ref: 'region', module: 'content-management' },
    },
];
