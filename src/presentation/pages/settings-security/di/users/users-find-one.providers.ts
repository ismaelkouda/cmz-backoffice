import { Provider } from '@angular/core';

import { UsersFindOneUseCase } from '@presentation/pages/settings-security/core/application/use-cases/users/users-find-one.use-case';
import { UsersFindOneRepository } from '@presentation/pages/settings-security/core/domain/repositories/users/users-find-one-repository';
import { UsersFindOneMapper } from '@presentation/pages/settings-security/infrastructure/data/mappers/users/users-find-one.mapper';
import { UsersFindOneRepositoryImpl } from '@presentation/pages/settings-security/infrastructure/data/repositories/users/users-find-one-repository.impl';
import { UsersFindOneApi } from '@presentation/pages/settings-security/infrastructure/data/sources/users/users-find-one.api';

export const usersFindOneProviders: Provider[] = [
    UsersFindOneApi,
    UsersFindOneMapper,
    UsersFindOneUseCase,
    {
        provide: UsersFindOneRepository,
        useClass: UsersFindOneRepositoryImpl,
    },
];
