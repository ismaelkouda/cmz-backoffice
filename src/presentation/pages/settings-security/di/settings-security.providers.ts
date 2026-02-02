import { inject, Provider } from '@angular/core';

import { EnvService } from '@shared/services/env.service';

import { accessLogsProviders } from '@presentation/pages/settings-security/di/access-logs/access-logs.providers';
import { profilsHabilitationsFindOneProviders } from '@presentation/pages/settings-security/di/profils-habilitations/profils-habilitations-findone.providers';
import { profilsHabilitationsFreeUsersProviders } from '@presentation/pages/settings-security/di/profils-habilitations/profils-habilitations-free-users.providers';
import { profilsHabilitationsUsersProviders } from '@presentation/pages/settings-security/di/profils-habilitations/profils-habilitations-users.providers';
import { profilsHabilitationsProviders } from '@presentation/pages/settings-security/di/profils-habilitations/profils-habilitations.providers';
import { profilesSelectProviders } from '@presentation/pages/settings-security/di/users/profiles-select.providers';
import { responsibilitiesSelectProviders } from '@presentation/pages/settings-security/di/users/responsibilities-select.providers';
import { usersFindoneProviders } from '@presentation/pages/settings-security/di/users/users-findone.providers';
import { usersProviders } from '@presentation/pages/settings-security/di/users/users.providers';
import { SETTINGS_SECURITY_BASE_URL } from '@presentation/pages/settings-security/infrastructure/api/settings-security.base-url';

const getApiBaseUrl = () => {
    const baseUrl = inject(EnvService).authenticationUrl;

    if (!baseUrl) {
        console.warn(
            'SettingsSecurity Module: API Base URL is missing in environment configuration.'
        );
    }

    return baseUrl;
};

export const provideSettingsSecurity = (): Provider[] => [
    {
        provide: SETTINGS_SECURITY_BASE_URL,
        useFactory: getApiBaseUrl,
    },
    ...accessLogsProviders,

    ...usersProviders,
    ...usersFindoneProviders,
    ...profilesSelectProviders,
    ...responsibilitiesSelectProviders,

    ...profilsHabilitationsProviders,
    ...profilsHabilitationsUsersProviders,
    ...profilsHabilitationsFindOneProviders,
    ...profilsHabilitationsFreeUsersProviders,
];
