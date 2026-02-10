import { Provider } from '@angular/core';

import { AgentsPerformancesFindOneRepository } from '@presentation/pages/team-organization/domain/repositories/agents-performances/agents-performances-findone-repository';
import { AgentsPerformancesFindOneRepositoryImpl } from '@presentation/pages/team-organization/infrastructure/data/repositories/agents-performances/agents-performances-findone-repository.impl';

export const teamsFindOneProviders: Provider[] = [
    {
        provide: AgentsPerformancesFindOneRepository,
        useClass: AgentsPerformancesFindOneRepositoryImpl,
    },
];
