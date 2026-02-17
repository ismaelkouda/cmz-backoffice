import { Provider } from '@angular/core';

import { ProfilesPermissionsUseCase } from '@presentation/pages/settings-security/core/application/use-cases/profiles-permissions/profiles-permissions.use-case';
import { ProfilesPermissionsRepository } from '@presentation/pages/settings-security/core/domain/repositories/profiles-permissions/profiles-permissions-repository';
import { ProfilesPermissionsMapper } from '@presentation/pages/settings-security/infrastructure/data/mappers/profiles-permissions/profiles-permissions.mapper';
import { ProfilesPermissionsRepositoryImpl } from '@presentation/pages/settings-security/infrastructure/data/repositories/profiles-permissions/profiles-permissions-repository.impl';
import { ProfilesPermissionsApi } from '@presentation/pages/settings-security/infrastructure/data/sources/profiles-permissions/profiles-permissions.api';

export const profilesPermissionsProviders: Provider[] = [
    ProfilesPermissionsApi,
    ProfilesPermissionsMapper,
    ProfilesPermissionsUseCase,
    {
        provide: ProfilesPermissionsRepository,
        useClass: ProfilesPermissionsRepositoryImpl,
    },
];
