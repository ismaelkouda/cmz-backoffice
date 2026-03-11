import { Provider } from '@angular/core';
import { AgentsPerformancesRepository } from '@pages/team-organization/domain/repositories/agents-performances/agents-performances.repository';
import { AgentsPerformancesRepositoryImpl } from '@pages/team-organization/infrastructure/data/repositories/agents-performances/agents-performances-repository.impl';

export const agentsPerformancesProviders: Provider[] = [
    {
        provide: AgentsPerformancesRepository,
        useClass: AgentsPerformancesRepositoryImpl,
    },
];
