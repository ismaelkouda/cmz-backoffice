import { PRIVACY_POLICY_ROUTE } from '@pages/content-management/content-management.routes';
import {
    PRIVACY_POLICY_LIST_ROUTE,
    PRIVACY_POLICY_HISTORY_ROUTE,
} from '@presentation/pages/content-management/presentation/features/privacy-policy/privacy-policy-paths.constants';
import { CONTENT_MANAGEMENT_ROUTE } from '@shared/routes/routes';

export const PRIVACY_POLICY_TABS = [
    {
        value: '0',
        route: `/${CONTENT_MANAGEMENT_ROUTE}/${PRIVACY_POLICY_ROUTE}/${PRIVACY_POLICY_LIST_ROUTE}`,
        label: 'CONTENT_MANAGEMENT.PRIVACY_POLICY.TABS.PRIVACY_POLICY.LABEL',
        icon: 'pi pi-list',
    },
    {
        value: '1',
        route: `/${CONTENT_MANAGEMENT_ROUTE}/${PRIVACY_POLICY_ROUTE}/${PRIVACY_POLICY_HISTORY_ROUTE}`,
        label: 'CONTENT_MANAGEMENT.PRIVACY_POLICY.TABS.HISTORY.LABEL',
        icon: 'pi pi-history',
        queryParams: { ref: 'privacy-policy', module: 'content-management' },
    },
];
