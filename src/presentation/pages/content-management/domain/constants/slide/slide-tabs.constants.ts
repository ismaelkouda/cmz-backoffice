import { SLIDE_ROUTE } from '@pages/content-management/content-management.routes';
import {
    SLIDE_LIST_ROUTE,
    SLIDE_HISTORY_ROUTE,
} from '@presentation/pages/content-management/presentation/features/slide/slide-paths.constants';
import { CONTENT_MANAGEMENT_ROUTE } from '@shared/routes/routes';

export const SLIDE_TABS = [
    {
        value: '0',
        route: `/${CONTENT_MANAGEMENT_ROUTE}/${SLIDE_ROUTE}/${SLIDE_LIST_ROUTE}`,
        label: 'CONTENT_MANAGEMENT.SLIDE.TABS.SLIDE.LABEL',
        icon: 'pi pi-list',
    },
    {
        value: '1',
        route: `/${CONTENT_MANAGEMENT_ROUTE}/${SLIDE_ROUTE}/${SLIDE_HISTORY_ROUTE}`,
        label: 'CONTENT_MANAGEMENT.SLIDE.TABS.HISTORY.LABEL',
        icon: 'pi pi-history',
        queryParams: { ref: 'slide', module: 'content-management' },
    },
];
