import { Provider } from '@angular/core';
import { UsersFindOneUseCase } from '@pages/settings-security/application/use-cases/users/users-find-one.use-case';
import { UsersFindOneRepository } from '@pages/settings-security/domain/repositories/users/users-find-one-repository';
import { UsersFindOneMapper } from '@pages/settings-security/infrastructure/data/mappers/users/users-find-one.mapper';
import { UsersFindOneRepositoryImpl } from '@pages/settings-security/infrastructure/data/repositories/users/users-find-one-repository.impl';
import { UsersFindOneApi } from '@pages/settings-security/infrastructure/data/sources/users/users-find-one.api';

export const usersFindOneProviders: Provider[] = [
    UsersFindOneApi,
    UsersFindOneMapper,
    UsersFindOneUseCase,
    {
        provide: UsersFindOneRepository,
        useClass: UsersFindOneRepositoryImpl,
    },
];
