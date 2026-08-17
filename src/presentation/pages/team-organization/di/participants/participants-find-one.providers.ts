import { Provider } from '@angular/core';
import { ParticipantsFindOneRepository } from '@pages/team-organization/domain/repositories/participants/participants-find-one-repository';
import { ParticipantsFindOneRepositoryImpl } from '@pages/team-organization/infrastructure/data/repositories/participants/participants-find-one-repository.impl';

export const participantsFindOneProviders: Provider[] = [
    {
        provide: ParticipantsFindOneRepository,
        useClass: ParticipantsFindOneRepositoryImpl,
    },
];
