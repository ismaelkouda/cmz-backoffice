import { Provider } from '@angular/core';
import { TeamsSelectRepository } from '@pages/team-organization/domain/repositories/teams/teams-select-repository';
import { TeamsSelectRepositoryImpl } from '@pages/team-organization/infrastructure/data/repositories/teams/teams-select-repository.impl';

export const teamsSelectProviders: Provider[] = [
    {
        provide: TeamsSelectRepository,
        useClass: TeamsSelectRepositoryImpl,
    },
];
