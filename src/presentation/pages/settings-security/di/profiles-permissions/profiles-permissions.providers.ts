import { Provider } from '@angular/core';
import { ProfilesPermissionsRepository } from '@pages/settings-security/domain/repositories/profiles-permissions/profiles-permissions-repository';
import { ProfilesPermissionsRepositoryImpl } from '@pages/settings-security/infrastructure/data/repositories/profiles-permissions/profiles-permissions-repository.impl';

export const profilesPermissionsProviders: Provider[] = [
    {
        provide: ProfilesPermissionsRepository,
        useClass: ProfilesPermissionsRepositoryImpl,
    },
];
