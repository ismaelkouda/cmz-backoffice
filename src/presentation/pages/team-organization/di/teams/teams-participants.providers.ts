import { Provider } from '@angular/core';
import { TeamsParticipantsRepository } from '@pages/team-organization/domain/repositories/teams/teams-participants-repository';
import { TeamsParticipantsRepositoryImpl } from '@pages/team-organization/infrastructure/data/repositories/teams/teams-participants-repository.impl';

export const teamsParticipantsProviders: Provider[] = [
    {
        provide: TeamsParticipantsRepository,
        useClass: TeamsParticipantsRepositoryImpl,
    },
];
