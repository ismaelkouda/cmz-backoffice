import { Provider } from '@angular/core';

import { ProfilesPermissionsFreeUsersUseCase } from '@presentation/pages/settings-security/core/application/use-cases/profiles-permissions/profiles-permissions-free-users.use-case';
import { ProfilesPermissionsFreeUsersRepository } from '@presentation/pages/settings-security/core/domain/repositories/profiles-permissions/profiles-permissions-free-users-repository';
import { ProfilesPermissionsFreeUsersMapper } from '@presentation/pages/settings-security/infrastructure/data/mappers/profiles-permissions/profiles-permissions-free-users.mapper';
import { ProfilesPermissionsFreeUsersRepositoryImpl } from '@presentation/pages/settings-security/infrastructure/data/repositories/profiles-permissions/profiles-permissions-free-users-repository.impl';
import { ProfilesPermissionsFreeUsersApi } from '@presentation/pages/settings-security/infrastructure/data/sources/profiles-permissions/profiles-permissions-free-users.api';

export const profilesPermissionsFreeUsersProviders: Provider[] = [
    ProfilesPermissionsFreeUsersApi,
    ProfilesPermissionsFreeUsersMapper,
    ProfilesPermissionsFreeUsersUseCase,
    {
        provide: ProfilesPermissionsFreeUsersRepository,
        useClass: ProfilesPermissionsFreeUsersRepositoryImpl,
    },
];
