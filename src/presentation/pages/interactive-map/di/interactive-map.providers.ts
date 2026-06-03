import { inject, Provider } from '@angular/core';
import { provideMapClusters } from '@shared/components/map-clusters/di/map-clusters.providers';

import { EnvService } from '../../../../core/config/env.service';
import { provideMap } from './map.providers';
import { DASHBOARD_MAP_BASE_URL } from '../infrastructure/api/interactive-map.base-url';
import { INTERACTIVE_MAP_BASE_URL } from '../infrastructure/api/interactive-map.base-url';

const getApiBaseInteractionMap = () => {
    const baseUrl = inject(EnvService).reportUrl;

    if (!baseUrl) {
        console.warn(
            'interactive-map Module: API Base URL is missing in environment configuration.'
        );
    }

    return baseUrl;
};

const getApiBaseDashboardMap = () => {
    const baseUrl = inject(EnvService).settingUrl;

    if (!baseUrl) {
        console.warn(
            'interactive-map Module: API Base URL is missing in environment configuration.'
        );
    }

    return baseUrl;
};

export const provideInteractiveMap = (): Provider[] => [
    {
        provide: INTERACTIVE_MAP_BASE_URL,
        useFactory: getApiBaseInteractionMap,
    },
    {
        provide: DASHBOARD_MAP_BASE_URL,
        useFactory: getApiBaseDashboardMap,
    },
    ...provideMapClusters,
    ...provideMap,
];
