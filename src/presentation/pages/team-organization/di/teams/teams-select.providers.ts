import { Provider } from '@angular/core';

import { TeamsSelectUseCase } from '@presentation/pages/team-organization/application/use-cases/teams/teams-select.use-case';
import { TeamsSelectRepository } from '@presentation/pages/team-organization/domain/repositories/teams/teams-select-repository';
import { TeamsSelectMapper } from '@presentation/pages/team-organization/infrastructure/data/mappers/teams/teams-select.mapper';
import { TeamsSelectRepositoryImpl } from '@presentation/pages/team-organization/infrastructure/data/repositories/teams/teams-select-repository.impl';
import { TeamsSelectApi } from '@presentation/pages/team-organization/infrastructure/data/sources/teams/teams-select.api';

export const teamsSelectProviders: Provider[] = [
    TeamsSelectApi,
    TeamsSelectMapper,
    TeamsSelectUseCase,
    {
        provide: TeamsSelectRepository,
        useClass: TeamsSelectRepositoryImpl,
    },
];
