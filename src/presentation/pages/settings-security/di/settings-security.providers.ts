import { inject, Provider } from "@angular/core";
import { accessLogsProviders } from "@presentation/pages/settings-security/di/access-logs/access-logs.providers";
import { SETTINGS_SECURITY_BASE_URL } from "@presentation/pages/settings-security/infrastructure/api/settings-security.base-url";
import { EnvService } from "@shared/services/env.service";

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
    ...accessLogsProviders
];
