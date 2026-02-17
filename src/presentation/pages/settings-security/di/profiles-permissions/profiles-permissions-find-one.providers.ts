import { Provider } from '@angular/core';

import { ProfilesPermissionsFindOneUseCase } from '@presentation/pages/settings-security/core/application/use-cases/profiles-permissions/profiles-permissions-find-one.use-case';
import { ProfilesPermissionsFindOneRepository } from '@presentation/pages/settings-security/core/domain/repositories/profiles-permissions/profiles-permissions-find-one-repository';
import { ProfilesPermissionsFindOneMapper } from '@presentation/pages/settings-security/infrastructure/data/mappers/profiles-permissions/profiles-permissions-find-one.mapper';
import { ProfilesPermissionsFindOneRepositoryImpl } from '@presentation/pages/settings-security/infrastructure/data/repositories/profiles-permissions/profiles-permissions-find-one-repository.impl';
import { ProfilesPermissionsFindOneApi } from '@presentation/pages/settings-security/infrastructure/data/sources/profiles-permissions/profiles-permissions-find-one.api';

export const profilesPermissionsFindOneProviders: Provider[] = [
    ProfilesPermissionsFindOneApi,
    ProfilesPermissionsFindOneMapper,
    ProfilesPermissionsFindOneUseCase,
    {
        provide: ProfilesPermissionsFindOneRepository,
        useClass: ProfilesPermissionsFindOneRepositoryImpl,
    },
];
