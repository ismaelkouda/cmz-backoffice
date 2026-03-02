import { Provider } from '@angular/core';

import { ParticipantsSelectRepository } from '@presentation/pages/team-organization/domain/repositories/participants/participants-select-repository';
import { ParticipantsSelectRepositoryImpl } from '@presentation/pages/team-organization/infrastructure/data/repositories/participants/participants-select-repository.impl';

export const participantsSelectProviders: Provider[] = [
    {
        provide: ParticipantsSelectRepository,
        useClass: ParticipantsSelectRepositoryImpl,
    },
];
