import { Provider } from '@angular/core';

import { TeamsParticipantsUseCase } from '@presentation/pages/team-organization/application/use-cases/teams/teams-participants.use-case';
import { TeamsParticipantsRepository } from '@presentation/pages/team-organization/domain/repositories/teams/teams-participants-repository';
import { TeamsParticipantsMapper } from '@presentation/pages/team-organization/infrastructure/data/mappers/teams/teams-participants.mapper';
import { TeamsParticipantsRepositoryImpl } from '@presentation/pages/team-organization/infrastructure/data/repositories/teams/teams-participants-repository.impl';
import { TeamsParticipantsApi } from '@presentation/pages/team-organization/infrastructure/data/sources/teams/teams-participants.api';

export const teamsParticipantsProviders: Provider[] = [
    TeamsParticipantsApi,
    TeamsParticipantsMapper,
    TeamsParticipantsUseCase,
    {
        provide: TeamsParticipantsRepository,
        useClass: TeamsParticipantsRepositoryImpl,
    },
];
