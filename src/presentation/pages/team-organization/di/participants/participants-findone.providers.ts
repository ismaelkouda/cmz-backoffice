import { Provider } from '@angular/core';

import { ParticipantsFindOneUseCase } from '@presentation/pages/team-organization/application/use-cases/participants/participants-find-one.use-case';
import { ParticipantsFindOneRepository } from '@presentation/pages/team-organization/domain/repositories/participants/participants-find-one-repository';
import { ParticipantsFindOneMapper } from '@presentation/pages/team-organization/infrastructure/data/mappers/participants/participants-find-one.mapper';
import { ParticipantsFindOneRepositoryImpl } from '@presentation/pages/team-organization/infrastructure/data/repositories/participants/participants-find-one-repository.impl';
import { ParticipantsFindOneApi } from '@presentation/pages/team-organization/infrastructure/data/sources/participants/participants-find-one.api';

export const participantsFindoneProviders: Provider[] = [
    ParticipantsFindOneApi,
    ParticipantsFindOneMapper,
    ParticipantsFindOneUseCase,
    {
        provide: ParticipantsFindOneRepository,
        useClass: ParticipantsFindOneRepositoryImpl,
    },
];
