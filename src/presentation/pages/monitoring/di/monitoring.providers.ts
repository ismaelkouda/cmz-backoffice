import { inject, Provider } from '@angular/core';

import { EnvService } from '../../../../core/config/env.service';
import { NodeRepository } from '../domain/repositories/node-repository.interface';
import { ResourcesRepository } from '../domain/repositories/resources-repository.interface';
import { ServicesRepository } from '../domain/repositories/services-repository.interface';
import { MONITORING_API_BASE_URL } from '../infrastructure/api/monitoring.config';
import { NodeMapper } from '../infrastructure/data/mappers/node.mapper';
import { ResourcesMapper } from '../infrastructure/data/mappers/resources.mapper';
import { ServicesMapper } from '../infrastructure/data/mappers/services.mapper';
import { NodeRepositoryImpl } from '../infrastructure/data/repositories/node.repository.impl';
import { ResourcesRepositoryImpl } from '../infrastructure/data/repositories/resources.repository.impl';
import { ServicesRepositoryImpl } from '../infrastructure/data/repositories/services.repository.impl';
import { NodeApi } from '../infrastructure/data/sources/node.api';
import { ResourcesApi } from '../infrastructure/data/sources/resources.api';
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
    ResourcesApi,
    NodeMapper,
    ServicesMapper,
    ResourcesMapper,
    { provide: NodeRepository, useClass: NodeRepositoryImpl },
    { provide: ServicesRepository, useClass: ServicesRepositoryImpl },
    { provide: ResourcesRepository, useClass: ResourcesRepositoryImpl },
];
