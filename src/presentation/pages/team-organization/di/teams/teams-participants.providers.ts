import { Provider } from '@angular/core';

import { TeamsParticipantsRepository } from '@presentation/pages/team-organization/domain/repositories/teams/teams-participants-repository';
import { TeamsParticipantsRepositoryImpl } from '@presentation/pages/team-organization/infrastructure/data/repositories/teams/teams-participants-repository.impl';

export const teamsParticipantsProviders: Provider[] = [
    {
        provide: TeamsParticipantsRepository,
        useClass: TeamsParticipantsRepositoryImpl,
    },
];
