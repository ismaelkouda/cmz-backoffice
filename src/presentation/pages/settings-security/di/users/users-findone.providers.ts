import { Provider } from '@angular/core';

import { UsersFindonUseCase } from '@presentation/pages/settings-security/core/application/use-cases/users/users-findone.use-case';
import { UsersFindonRepository } from '@presentation/pages/settings-security/core/domain/repositories/users/users-findone-repository';
import { UsersFindonMapper } from '@presentation/pages/settings-security/infrastructure/data/mappers/users/users-findone.mapper';
import { UsersFindonRepositoryImpl } from '@presentation/pages/settings-security/infrastructure/data/repositories/users/users-findone-repository.impl';
import { UsersFindonApi } from '@presentation/pages/settings-security/infrastructure/data/sources/users/users-findone.api';

export const usersFindoneProviders: Provider[] = [
    UsersFindonApi,
    UsersFindonMapper,
    UsersFindonUseCase,
    {
        provide: UsersFindonRepository,
        useClass: UsersFindonRepositoryImpl,
    },
];
