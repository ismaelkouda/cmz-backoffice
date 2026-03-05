import { inject, Provider } from '@angular/core';

import { EnvService } from '@shared/domain/services/env.service';

import { accessLogsProviders } from '@presentation/pages/settings-security/di/access-logs/access-logs.providers';
import { profilesPermissionsFindOneProviders } from '@presentation/pages/settings-security/di/profiles-permissions/profiles-permissions-find-one.providers';
import { profilesPermissionsFreeUsersProviders } from '@presentation/pages/settings-security/di/profiles-permissions/profiles-permissions-free-users.providers';
import { profilesPermissionsPermissionsProviders } from '@presentation/pages/settings-security/di/profiles-permissions/profiles-permissions-permissions.providers';
import { profilesPermissionsSelectProviders } from '@presentation/pages/settings-security/di/profiles-permissions/profiles-permissions-select.providers';
import { profilesPermissionsUsersProviders } from '@presentation/pages/settings-security/di/profiles-permissions/profiles-permissions-users.providers';
import { profilesPermissionsProviders } from '@presentation/pages/settings-security/di/profiles-permissions/profiles-permissions.providers';
import { responsibilitiesSelectProviders } from '@presentation/pages/settings-security/di/users/responsibilities-select.providers';
import { usersFindOneProviders } from '@presentation/pages/settings-security/di/users/users-find-one.providers';
import { usersSelectProviders } from '@presentation/pages/settings-security/di/users/users-select.providers';
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
    ...usersFindOneProviders,
    ...usersSelectProviders,
    ...responsibilitiesSelectProviders,

    ...profilesPermissionsProviders,
    ...profilesPermissionsUsersProviders,
    ...profilesPermissionsFindOneProviders,
    ...profilesPermissionsFreeUsersProviders,
    ...profilesPermissionsPermissionsProviders,
    ...profilesPermissionsSelectProviders,
];
