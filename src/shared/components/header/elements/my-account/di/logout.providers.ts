import { Provider } from '@angular/core';
import { LogoutRepository } from '../domain/repositories/logout.repository';
import { LogoutRepositoryImpl } from '../infrastructure/data/repositories/logout.repository.impl';

export const provideLogout: Provider[] = [
    {
        provide: LogoutRepository,
        useClass: LogoutRepositoryImpl,
    },
];
