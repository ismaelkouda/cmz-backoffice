import { Provider } from '@angular/core';
import { ParticipantRepository } from '../domain/repositories/participant.repository';
import { ParticipantRepositoryImpl } from '../data/repositories/participant.repository.impl';

export const provideParticipant = (): Provider[] => [
    {
        provide: ParticipantRepository,
        useClass: ParticipantRepositoryImpl,
    },
];

