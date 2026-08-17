import { Provider } from '@angular/core';
import { UsersRepository } from '@pages/settings-security/domain/repositories/users/users-repository';
import { UsersRepositoryImpl } from '@pages/settings-security/infrastructure/data/repositories/users/users-repository.impl';

export const usersProviders: Provider[] = [
    {
        provide: UsersRepository,
        useClass: UsersRepositoryImpl,
    },
];
