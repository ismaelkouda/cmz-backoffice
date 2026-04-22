import { inject, Provider } from '@angular/core';
import { accessLogsProviders } from '@pages/settings-security/di/access-logs/access-logs.providers';
import { profilesPermissionsFindOneProviders } from '@pages/settings-security/di/profiles-permissions/profiles-permissions-find-one.providers';
import { profilesPermissionsFreeUsersProviders } from '@pages/settings-security/di/profiles-permissions/profiles-permissions-free-users.providers';
import { profilesPermissionsPermissionsProviders } from '@pages/settings-security/di/profiles-permissions/profiles-permissions-permissions.providers';
import { profilesPermissionsSelectProviders } from '@pages/settings-security/di/profiles-permissions/profiles-permissions-select.providers';
import { profilesPermissionsUsersProviders } from '@pages/settings-security/di/profiles-permissions/profiles-permissions-users.providers';
import { profilesPermissionsProviders } from '@pages/settings-security/di/profiles-permissions/profiles-permissions.providers';
import { responsibilitiesSelectProviders } from '@pages/settings-security/di/users/responsibilities-select.providers';
import { usersFindOneProviders } from '@pages/settings-security/di/users/users-find-one.providers';
import { usersSelectProviders } from '@pages/settings-security/di/users/users-select.providers';
import { usersProviders } from '@pages/settings-security/di/users/users.providers';
import {
    SETTINGS_SECURITY_BASE_URL,
    SETTINGS_SECURITY_LOGS_BASE_URL,
} from '@pages/settings-security/infrastructure/api/settings-security.base-url';
import { EnvService } from '@shared/domain/services/env.service';

const getApiBaseUrl = () => {
    const baseUrl = inject(EnvService).settingUrl;

    if (!baseUrl) {
        console.warn(
            'SettingsSecurity Module: API Base URL is missing in environment configuration.'
        );
    }

    return baseUrl;
};

const getLogApiBaseUrl = () => {
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
    {
        provide: SETTINGS_SECURITY_LOGS_BASE_URL,
        useFactory: getLogApiBaseUrl,
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
