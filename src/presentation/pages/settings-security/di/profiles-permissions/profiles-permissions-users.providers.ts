import { Provider } from '@angular/core';

import { ProfilesPermissionsUsersUseCase } from '@presentation/pages/settings-security/core/application/use-cases/profiles-permissions/profiles-permissions-users.use-case';
import { ProfilesPermissionsUsersRepository } from '@presentation/pages/settings-security/core/domain/repositories/profiles-permissions/profiles-permissions-users-repository';
import { ProfilesPermissionsUsersMapper } from '@presentation/pages/settings-security/infrastructure/data/mappers/profiles-permissions/profiles-permissions-users.mapper';
import { ProfilesPermissionsUsersRepositoryImpl } from '@presentation/pages/settings-security/infrastructure/data/repositories/profiles-permissions/profiles-permissions-users-repository.impl';
import { ProfilesPermissionsUsersApi } from '@presentation/pages/settings-security/infrastructure/data/sources/profiles-permissions/profiles-permissions-users.api';

export const profilesPermissionsUsersProviders: Provider[] = [
    ProfilesPermissionsUsersApi,
    ProfilesPermissionsUsersMapper,
    ProfilesPermissionsUsersUseCase,
    {
        provide: ProfilesPermissionsUsersRepository,
        useClass: ProfilesPermissionsUsersRepositoryImpl,
    },
];
