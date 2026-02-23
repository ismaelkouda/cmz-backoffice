import { Provider } from '@angular/core';

import { TeamsPermissionsRepository } from '@presentation/pages/team-organization/domain/repositories/teams/teams-permissions-repository';
import { TeamsPermissionsRepositoryImpl } from '@presentation/pages/team-organization/infrastructure/data/repositories/teams/teams-permissions-repository.impl';

export const teamsPermissionsProviders: Provider[] = [
    {
        provide: TeamsPermissionsRepository,
        useClass: TeamsPermissionsRepositoryImpl,
    },
];
