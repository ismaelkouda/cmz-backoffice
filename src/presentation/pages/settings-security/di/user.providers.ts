import { Provider } from '@angular/core';
import { UserRepository } from '../domain/repositories/user.repository';
import { UserRepositoryImpl } from '../data/repositories/user.repository.impl';

export const provideUser = (): Provider[] => [
    {
        provide: UserRepository,
        useClass: UserRepositoryImpl,
    },
];
