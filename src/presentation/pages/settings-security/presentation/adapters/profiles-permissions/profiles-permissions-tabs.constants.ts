import { PROFILES_PERMISSIONS_LIST } from '@pages/settings-security/presentation/profiles-permissions/profiles-permissions.routes';
import { PROFILES_PERMISSIONS_ROUTE } from '@pages/settings-security/settings-security.routes';
import { SETTINGS_SECURITY_ROUTE } from '@shared/routes/routes';

export const PROFILES_PERMISSIONS_TABS = [
    {
        value: '0',
        route: `/${SETTINGS_SECURITY_ROUTE}/${PROFILES_PERMISSIONS_ROUTE}/${PROFILES_PERMISSIONS_LIST}`,
        label: 'SETTINGS_SECURITY.PROFILES_PERMISSIONS.TABS.PROFILES_PERMISSIONS.LABEL',
        icon: 'pi pi-list',
    },
    {
        value: '1',
        route: `/${SETTINGS_SECURITY_ROUTE}/${PROFILES_PERMISSIONS_ROUTE}/history`,
        label: 'SETTINGS_SECURITY.PROFILES_PERMISSIONS.TABS.HISTORY.LABEL',
        icon: 'pi pi-history',
        queryParams: { user: 'test' },
    },
];
