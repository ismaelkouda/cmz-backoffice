import { Provider } from '@angular/core';

import { UsersSelectRepository } from '@presentation/pages/settings-security/domain/repositories/users/users-select-repository';
import { UsersSelectRepositoryImpl } from '@presentation/pages/settings-security/infrastructure/data/repositories/users/users-select-repository.impl';

export const usersSelectProviders: Provider[] = [
    {
        provide: UsersSelectRepository,
        useClass: UsersSelectRepositoryImpl,
    },
];
