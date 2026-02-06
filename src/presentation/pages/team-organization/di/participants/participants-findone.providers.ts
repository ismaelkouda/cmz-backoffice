import { Provider } from '@angular/core';

import { ParticipantsFindonUseCase } from '@presentation/pages/team-organization/application/use-cases/participants/participants-findone.use-case';
import { ParticipantsFindonRepository } from '@presentation/pages/team-organization/domain/repositories/participants/participants-findone-repository';
import { ParticipantsFindonMapper } from '@presentation/pages/team-organization/infrastructure/data/mappers/participants/participants-findone.mapper';
import { ParticipantsFindonRepositoryImpl } from '@presentation/pages/team-organization/infrastructure/data/repositories/participants/participants-findone-repository.impl';
import { ParticipantsFindonApi } from '@presentation/pages/team-organization/infrastructure/data/sources/participants/participants-findone.api';

export const participantsFindoneProviders: Provider[] = [
    ParticipantsFindonApi,
    ParticipantsFindonMapper,
    ParticipantsFindonUseCase,
    {
        provide: ParticipantsFindonRepository,
        useClass: ParticipantsFindonRepositoryImpl,
    },
];
