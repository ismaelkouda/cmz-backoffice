import { Provider } from '@angular/core';

import { TeamsSelectRepository } from '@presentation/pages/team-organization/domain/repositories/teams/teams-select-repository';
import { TeamsSelectRepositoryImpl } from '@presentation/pages/team-organization/infrastructure/data/repositories/teams/teams-select-repository.impl';

export const teamsSelectProviders: Provider[] = [
    {
        provide: TeamsSelectRepository,
        useClass: TeamsSelectRepositoryImpl,
    },
];
