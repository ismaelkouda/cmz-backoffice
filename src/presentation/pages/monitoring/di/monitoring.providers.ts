import { Provider } from '@angular/core';

import { NodeRepository } from '../domain/repositories/node-repository.interface';
import { ResourcesRepository } from '../domain/repositories/resources-repository.interface';
import { ServicesRepository } from '../domain/repositories/services-repository.interface';
import { NodeRepositoryImpl } from '../infrastructure/data/repositories/node.repository.impl';
import { ResourcesRepositoryImpl } from '../infrastructure/data/repositories/resources.repository.impl';
import { ServicesRepositoryImpl } from '../infrastructure/data/repositories/services.repository.impl';
import { JobsRepository } from '../domain/repositories/jobs-repository.interface';
import { JobsRepositoryImpl } from '../infrastructure/data/repositories/jobs.repository.impl';

export const provideMonitoring = (): Provider[] => [
    { provide: NodeRepository, useClass: NodeRepositoryImpl },
    { provide: ServicesRepository, useClass: ServicesRepositoryImpl },
    { provide: ResourcesRepository, useClass: ResourcesRepositoryImpl },
    { provide: JobsRepository, useClass: JobsRepositoryImpl },
];
