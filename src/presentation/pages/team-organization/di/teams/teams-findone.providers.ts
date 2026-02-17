import { Provider } from '@angular/core';

import { TeamsFindOneUseCase } from '@presentation/pages/team-organization/application/use-cases/teams/teams-find-one.use-case';
import { TeamsFindOneRepository } from '@presentation/pages/team-organization/domain/repositories/teams/teams-find-one-repository';
import { TeamsFindOneRepositoryImpl } from '@presentation/pages/team-organization/infrastructure/data/repositories/teams/teams-find-one-repository.impl';

export const teamsFindOneProviders: Provider[] = [
    TeamsFindOneUseCase,
    {
        provide: TeamsFindOneRepository,
        useClass: TeamsFindOneRepositoryImpl,
    },
];
