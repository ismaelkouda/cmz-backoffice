import { Provider } from '@angular/core';

import { ParticipantsRepository } from '@presentation/pages/team-organization/domain/repositories/participants/participants-repository';
import { ParticipantsRepositoryImpl } from '@presentation/pages/team-organization/infrastructure/data/repositories/participants/participants-repository.impl';

export const participantsProviders: Provider[] = [
    {
        provide: ParticipantsRepository,
        useClass: ParticipantsRepositoryImpl,
    },
];
