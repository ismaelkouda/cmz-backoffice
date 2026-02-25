import { Provider } from '@angular/core';

import { TeamsFindOneRepository } from '@presentation/pages/team-organization/domain/repositories/teams/teams-find-one-repository';
import { TeamsFindOneRepositoryImpl } from '@presentation/pages/team-organization/infrastructure/data/repositories/teams/teams-find-one-repository.impl';

export const teamsFindOneProviders: Provider[] = [
    {
        provide: TeamsFindOneRepository,
        useClass: TeamsFindOneRepositoryImpl,
    },
];
