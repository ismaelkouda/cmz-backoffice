import { Provider } from '@angular/core';
import { ProfileHabilitationRepositoryImpl } from '../data/repositories/profile-habilitation.repository.impl';
import { ProfileHabilitationRepository } from '../domain/repositories/profile-habilitation.repository';

export const provideProfileHabilitation = (): Provider[] => [
    {
        provide: ProfileHabilitationRepository,
        useClass: ProfileHabilitationRepositoryImpl,
    },
];
