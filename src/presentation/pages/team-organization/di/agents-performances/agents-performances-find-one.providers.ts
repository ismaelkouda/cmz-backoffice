import { Provider } from '@angular/core';

import { AgentsPerformancesFindOneRepository } from '../../domain/repositories/agents-performances/agents-performances-find-one.repository';
import { AgentsPerformancesFindOneRepositoryImpl } from '../../infrastructure/data/repositories/agents-performances/agents-performances-find-one-repository.impl';

export const teamsFindOneProviders: Provider[] = [
    {
        provide: AgentsPerformancesFindOneRepository,
        useClass: AgentsPerformancesFindOneRepositoryImpl,
    },
];
