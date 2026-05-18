import { inject, Provider } from '@angular/core';

import { EnvService } from '../../../../core/config/env.service';
import { MapRepository } from '../domain/repositories/map-repository.interface';
import { GEOGRAPHICAL_MAP_API_BASE_URL } from '../infrastructure/api/geographical-map.config';
import { MapRepositoryImpl } from '../infrastructure/data/repositories/map.repository.impl';

const getApiBaseUrl = (): string => {
    const baseUrl = inject(EnvService).settingUrl;

    if (!baseUrl) {
        console.warn(
            'geographical map Module: API Base URL is missing in environment configuration.'
        );
    }

    return baseUrl;
};

export const provideGeographicalMap = (): Provider[] => [
    {
        provide: GEOGRAPHICAL_MAP_API_BASE_URL,
        useFactory: getApiBaseUrl,
    },
    { provide: MapRepository, useClass: MapRepositoryImpl },
];
