import { inject, Provider } from '@angular/core';
import { REQUESTS_BASE_URL } from '@presentation/pages/requests/infrastructure/api/requests.base-url';
import { provideMapClusters } from '@shared/components/map-clusters/di/map-clusters.providers';

import { EnvService } from '../../../../core/config/env.service';

const getApiBaseUrl = () => {
    const baseUrl = inject(EnvService).reportUrl;

    if (!baseUrl) {
        console.warn(
            'interactive-map Module: API Base URL is missing in environment configuration.'
        );
    }

    return baseUrl;
};

export const provideRequests = (): Provider[] => [
    {
        provide: REQUESTS_BASE_URL,
        useFactory: getApiBaseUrl,
    },
    ...provideMapClusters,
];
