import {
    USERS_LIST,
    USERS_HISTORY,
} from '@pages/settings-security/presentation/users/users-paths.constants';
import { USERS_ROUTE } from '@presentation/pages/settings-security/settings-security.routes';
import { SETTINGS_SECURITY_ROUTE } from '@shared/routes/routes';

export const USERS_TABS = [
    {
        value: '0',
        route: `/${SETTINGS_SECURITY_ROUTE}/${USERS_ROUTE}/${USERS_LIST}`,
        label: 'SETTINGS_SECURITY.USERS.TABS.USERS.LABEL',
        icon: 'pi pi-list',
    },
    {
        value: '1',
        route: `/${SETTINGS_SECURITY_ROUTE}/${USERS_ROUTE}/${USERS_HISTORY}`,
        label: 'SETTINGS_SECURITY.USERS.TABS.HISTORY.LABEL',
        icon: 'pi pi-history',
        queryParams: {
            ref: 'user',
        },
    },
] as const;
