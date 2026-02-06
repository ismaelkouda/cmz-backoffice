import { Provider } from '@angular/core';

import { AgentsPerformancesUseCase } from '@presentation/pages/team-organization/application/use-cases/agents-performances/agents-performances.use-case';
import { AgentsPerformancesRepository } from '@presentation/pages/team-organization/domain/repositories/agents-performances/agents-performances.repository';
import { AgentsPerformancesMapper } from '@presentation/pages/team-organization/infrastructure/data/mappers/agents-performances/agents-performances.mapper';
import { AgentsPerformancesRepositoryImpl } from '@presentation/pages/team-organization/infrastructure/data/repositories/agents-performances/agents-performances-repository.impl';
import { AgentsPerformancesApi } from '@presentation/pages/team-organization/infrastructure/data/sources/agents-participants/agents-performances.api';

export const agentsPerformancesProviders: Provider[] = [
    AgentsPerformancesUseCase,
    AgentsPerformancesApi,
    AgentsPerformancesMapper,
    {
        provide: AgentsPerformancesRepository,
        useClass: AgentsPerformancesRepositoryImpl,
    },
];
