import { Provider } from '@angular/core';

import { TeamsFindOneUseCase } from '@presentation/pages/team-organization/application/use-cases/teams/teams-findone.use-case';
import { TeamsFindOneRepository } from '@presentation/pages/team-organization/domain/repositories/teams/teams-findone-repository';
import { TeamsFindOneRepositoryImpl } from '@presentation/pages/team-organization/infrastructure/data/repositories/teams/teams-findone-repository.impl';

export const teamsFindOneProviders: Provider[] = [
    TeamsFindOneUseCase,
    {
        provide: TeamsFindOneRepository,
        useClass: TeamsFindOneRepositoryImpl,
    },
];
