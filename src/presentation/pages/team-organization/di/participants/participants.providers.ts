import { Provider } from '@angular/core';
import { ParticipantsRepository } from '@pages/team-organization/domain/repositories/participants/participants-repository';
import { ParticipantsRepositoryImpl } from '@pages/team-organization/infrastructure/data/repositories/participants/participants-repository.impl';

export const participantsProviders: Provider[] = [
    {
        provide: ParticipantsRepository,
        useClass: ParticipantsRepositoryImpl,
    },
];
