import { Provider } from '@angular/core';

import { UsersRepository } from '@presentation/pages/settings-security/core/domain/repositories/users/users-repository';
import { UsersRepositoryImpl } from '@presentation/pages/settings-security/infrastructure/data/repositories/users/users-repository.impl';

export const usersProviders: Provider[] = [
    {
        provide: UsersRepository,
        useClass: UsersRepositoryImpl,
    },
];
