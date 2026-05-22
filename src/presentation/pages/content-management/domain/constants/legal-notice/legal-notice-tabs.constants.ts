import { LEGAL_NOTICE_ROUTE } from '@pages/content-management/content-management.routes';
import {
    LEGAL_NOTICE_LIST_ROUTE,
    LEGAL_NOTICE_HISTORY_ROUTE,
} from '@presentation/pages/content-management/presentation/features/legal-notice/legal-notice-paths.constants';
import { CONTENT_MANAGEMENT_ROUTE } from '@shared/routes/routes';

export const LEGAL_NOTICE_TABS = [
    {
        value: '0',
        route: `/${CONTENT_MANAGEMENT_ROUTE}/${LEGAL_NOTICE_ROUTE}/${LEGAL_NOTICE_LIST_ROUTE}`,
        label: 'CONTENT_MANAGEMENT.LEGAL_NOTICE.TABS.LEGAL_NOTICE.LABEL',
        icon: 'pi pi-list',
    },
    {
        value: '1',
        route: `/${CONTENT_MANAGEMENT_ROUTE}/${LEGAL_NOTICE_ROUTE}/${LEGAL_NOTICE_HISTORY_ROUTE}`,
        label: 'CONTENT_MANAGEMENT.LEGAL_NOTICE.TABS.HISTORY.LABEL',
        icon: 'pi pi-history',
        queryParams: { ref: 'legal-notice', module: 'content-management' },
    },
];
