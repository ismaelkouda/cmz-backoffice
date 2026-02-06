import { Provider } from '@angular/core';

import { ParticipantsSelectUseCase } from '@presentation/pages/team-organization/application/use-cases/participants/participants-select.use-case';
import { ParticipantsSelectRepository } from '@presentation/pages/team-organization/domain/repositories/participants/participants-select-repository';
import { ParticipantsSelectMapper } from '@presentation/pages/team-organization/infrastructure/data/mappers/participants/participants-select.mapper';
import { ParticipantsSelectRepositoryImpl } from '@presentation/pages/team-organization/infrastructure/data/repositories/participants/participants-select-repository.impl';
import { ParticipantsSelectApi } from '@presentation/pages/team-organization/infrastructure/data/sources/participants/participants-select.api';

export const participantsSelectProviders: Provider[] = [
    ParticipantsSelectApi,
    ParticipantsSelectMapper,
    ParticipantsSelectUseCase,
    {
        provide: ParticipantsSelectRepository,
        useClass: ParticipantsSelectRepositoryImpl,
    },
];
