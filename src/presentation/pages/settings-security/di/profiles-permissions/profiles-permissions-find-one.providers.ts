import { Provider } from '@angular/core';
import { ProfilesPermissionsFindOneUseCase } from '@pages/settings-security/application/use-cases/profiles-permissions/profiles-permissions-find-one.use-case';
import { ProfilesPermissionsFindOneRepository } from '@pages/settings-security/domain/repositories/profiles-permissions/profiles-permissions-find-one-repository';
import { ProfilesPermissionsFindOneMapper } from '@pages/settings-security/infrastructure/data/mappers/profiles-permissions/profiles-permissions-find-one.mapper';
import { ProfilesPermissionsFindOneRepositoryImpl } from '@pages/settings-security/infrastructure/data/repositories/profiles-permissions/profiles-permissions-find-one-repository.impl';
import { ProfilesPermissionsFindOneApi } from '@pages/settings-security/infrastructure/data/sources/profiles-permissions/profiles-permissions-find-one.api';

export const profilesPermissionsFindOneProviders: Provider[] = [
    ProfilesPermissionsFindOneApi,
    ProfilesPermissionsFindOneMapper,
    ProfilesPermissionsFindOneUseCase,
    {
        provide: ProfilesPermissionsFindOneRepository,
        useClass: ProfilesPermissionsFindOneRepositoryImpl,
    },
];
