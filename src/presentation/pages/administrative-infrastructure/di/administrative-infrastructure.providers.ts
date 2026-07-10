import { inject, Provider } from '@angular/core';

import { responsibilitiesSelectProviders } from '@presentation/pages/administrative-infrastructure/di/infrastructure-type/responsibilities-select.providers';
import { infrastructureTypeFindOneProviders } from '@presentation/pages/administrative-infrastructure/di/infrastructure-type/infrastructure-type-find-one.providers';
import { infrastructureTypeSelectProviders } from '@presentation/pages/administrative-infrastructure/di/infrastructure-type/infrastructure-type-select.providers';
import { infrastructureTypeProviders } from '@presentation/pages/administrative-infrastructure/di/infrastructure-type/infrastructure-type.providers';
import { infrastructureFindOneProviders } from '@presentation/pages/administrative-infrastructure/di/infrastructure/infrastructure-find-one.providers';
import { infrastructureSelectProviders } from '@presentation/pages/administrative-infrastructure/di/infrastructure/infrastructure-select.providers';
import { infrastructureProviders } from '@presentation/pages/administrative-infrastructure/di/infrastructure/infrastructure.providers';
import {
    ADMINISTRATIVE_INFRASTRUCTURE_BASE_URL,
    ADMINISTRATIVE_INFRASTRUCTURE_LOGS_BASE_URL,
} from '@pages/administrative-infrastructure/infrastructure/api/administrative-infrastructure.base-url';

import { EnvService } from '../../../../core/config/env.service';

const getApiBaseUrl = () => {
    const baseUrl = inject(EnvService).settingUrl;

    if (!baseUrl) {
        console.warn(
            'AdministrativeInfrastructure Module: API Base URL is missing in environment configuration.'
        );
    }

    return baseUrl;
};

const getLogApiBaseUrl = () => {
    const baseUrl = inject(EnvService).authenticationUrl;

    if (!baseUrl) {
        console.warn(
            'AdministrativeInfrastructure Module: API Base URL is missing in environment configuration.'
        );
    }

    return baseUrl;
};

export const provideAdministrativeInfrastructure = (): Provider[] => [
    {
        provide: ADMINISTRATIVE_INFRASTRUCTURE_BASE_URL,
        useFactory: getApiBaseUrl,
    },
    {
        provide: ADMINISTRATIVE_INFRASTRUCTURE_LOGS_BASE_URL,
        useFactory: getLogApiBaseUrl,
    },

    ...infrastructureTypeProviders,
    ...infrastructureTypeFindOneProviders,
    ...infrastructureTypeSelectProviders,
    ...responsibilitiesSelectProviders,

    ...infrastructureProviders,
    ...infrastructureFindOneProviders,
    ...infrastructureSelectProviders,
];
