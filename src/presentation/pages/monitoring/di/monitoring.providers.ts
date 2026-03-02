import { inject, Provider } from '@angular/core';

import { EnvService } from '@shared/domain/services/env.service';

import { NodeRepository } from '../domain/repositories/node-repository.interface';
import { ServicesRepository } from '../domain/repositories/services-repository.interface';
import { MONITORING_API_BASE_URL } from '../infrastructure/api/monitoring.config';
import { NodeMapper } from '../infrastructure/data/mappers/node.mapper';
import { ServicesMapper } from '../infrastructure/data/mappers/services.mapper';
import { NodeRepositoryImpl } from '../infrastructure/data/repositories/node.repository.impl';
import { ServicesRepositoryImpl } from '../infrastructure/data/repositories/services.repository.impl';
import { NodeApi } from '../infrastructure/data/sources/node.api';
import { ServicesApi } from '../infrastructure/data/sources/services.api';

const getApiBaseUrl = (): string => {
    const baseUrl = inject(EnvService).settingUrl;

    if (!baseUrl) {
        console.warn(
            'Monitoring Module: API Base URL is missing in environment configuration.'
        );
    }

    return baseUrl;
};

export const provideMonitoring = (): Provider[] => [
    {
        provide: MONITORING_API_BASE_URL,
        useFactory: getApiBaseUrl,
    },
    NodeApi,
    ServicesApi,
    NodeMapper,
    ServicesMapper,
    { provide: NodeRepository, useClass: NodeRepositoryImpl },
    { provide: ServicesRepository, useClass: ServicesRepositoryImpl },
];
