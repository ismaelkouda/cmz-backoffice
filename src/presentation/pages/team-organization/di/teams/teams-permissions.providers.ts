import { Provider } from '@angular/core';

import { TeamsPermissionsUseCase } from '@presentation/pages/team-organization/application/use-cases/teams/teams-permissions.use-case';
import { TeamsPermissionsRepository } from '@presentation/pages/team-organization/domain/repositories/teams/teams-permissions-repository';
import { TeamsPermissionsMapper } from '@presentation/pages/team-organization/infrastructure/data/mappers/teams/teams-permissions.mapper';
import { TeamsPermissionsRepositoryImpl } from '@presentation/pages/team-organization/infrastructure/data/repositories/teams/teams-permissions-repository.impl';
import { TeamsPermissionsApi } from '@presentation/pages/team-organization/infrastructure/data/sources/teams/teams-permissions.api';

export const teamsPermissionsProviders: Provider[] = [
    TeamsPermissionsApi,
    TeamsPermissionsMapper,
    TeamsPermissionsUseCase,
    {
        provide: TeamsPermissionsRepository,
        useClass: TeamsPermissionsRepositoryImpl,
    },
];
