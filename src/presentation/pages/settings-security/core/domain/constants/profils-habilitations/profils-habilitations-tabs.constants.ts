import { SETTINGS_SECURITY_ROUTE } from '@shared/routes/routes';

import { PROFILES_HABILITATIONS_LIST } from '@presentation/pages/settings-security/presentation/profils-habilitations/profils-habilitations.routes';
import { PROFILES_HABILITATIONS_ROUTE } from '@presentation/pages/settings-security/settings-security.routes';

export const PROFILES_HABILITATIONS_TABS = [
    {
        value: '0',
        route: `/${SETTINGS_SECURITY_ROUTE}/${PROFILES_HABILITATIONS_ROUTE}/${PROFILES_HABILITATIONS_LIST}`,
        label: 'SETTINGS_SECURITY.PROFILES_HABILITATIONS.TABS.PROFILES_HABILITATIONS.LABEL',
        icon: 'pi pi-list',
    },
    {
        value: '1',
        route: `/${SETTINGS_SECURITY_ROUTE}/${PROFILES_HABILITATIONS_ROUTE}/history`,
        label: 'SETTINGS_SECURITY.PROFILES_HABILITATIONS.TABS.HISTORY.LABEL',
        icon: 'pi pi-history',
        queryParams: { user: 'test' },
    },
];
