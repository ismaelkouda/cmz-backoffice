import { Provider } from '@angular/core';
import { ProfileUpdateRepository } from '../domain/repositories/profile-update.repository';
import { ProfileUpdateRepositoryImpl } from '../infrastructure/data/repositories/profile-update.repository.impl';

export const provideProfileUpdate: Provider[] = [
    {
        provide: ProfileUpdateRepository,
        useClass: ProfileUpdateRepositoryImpl,
    },
];
