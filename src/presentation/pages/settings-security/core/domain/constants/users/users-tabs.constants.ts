import { SETTINGS_SECURITY_ROUTE } from '@shared/routes/routes';

import { USERS_LIST } from '@presentation/pages/settings-security/presentation/users/users.routes';

export const USERS_TABS = [
    {
        value: '0',
        route: `/${SETTINGS_SECURITY_ROUTE}/${USERS_LIST}`,
        label: 'SETTINGS_SECURITY.USERS.TABS.USERS.LABEL',
        icon: 'pi pi-list',
    },
    {
        value: '1',
        route: `/${SETTINGS_SECURITY_ROUTE}/history`,
        label: 'SETTINGS_SECURITY.USERS.TABS.HISTORY.LABEL',
        icon: 'pi pi-history',
        queryParams: { user: 'test' },
    },
];
