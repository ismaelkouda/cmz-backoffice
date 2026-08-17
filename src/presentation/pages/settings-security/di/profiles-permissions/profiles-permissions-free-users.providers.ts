import { Provider } from '@angular/core';
import { ProfilesPermissionsFreeUsersUseCase } from '@pages/settings-security/application/use-cases/profiles-permissions/profiles-permissions-free-users.use-case';
import { ProfilesPermissionsFreeUsersRepository } from '@pages/settings-security/domain/repositories/profiles-permissions/profiles-permissions-free-users-repository';
import { ProfilesPermissionsFreeUsersMapper } from '@pages/settings-security/infrastructure/data/mappers/profiles-permissions/profiles-permissions-free-users.mapper';
import { ProfilesPermissionsFreeUsersRepositoryImpl } from '@pages/settings-security/infrastructure/data/repositories/profiles-permissions/profiles-permissions-free-users-repository.impl';
import { ProfilesPermissionsFreeUsersApi } from '@pages/settings-security/infrastructure/data/sources/profiles-permissions/profiles-permissions-free-users.api';

export const profilesPermissionsFreeUsersProviders: Provider[] = [
    ProfilesPermissionsFreeUsersApi,
    ProfilesPermissionsFreeUsersMapper,
    ProfilesPermissionsFreeUsersUseCase,
    {
        provide: ProfilesPermissionsFreeUsersRepository,
        useClass: ProfilesPermissionsFreeUsersRepositoryImpl,
    },
];
