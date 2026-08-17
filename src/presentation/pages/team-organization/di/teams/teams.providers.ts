import { Provider } from '@angular/core';
import { TeamsRepository } from '@pages/team-organization/domain/repositories/teams/teams-repository';
import { TeamsRepositoryImpl } from '@pages/team-organization/infrastructure/data/repositories/teams/teams-repository.impl';

export const teamsProviders: Provider[] = [
    {
        provide: TeamsRepository,
        useClass: TeamsRepositoryImpl,
    },
];
