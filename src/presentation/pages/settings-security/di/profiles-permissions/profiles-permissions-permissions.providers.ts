import { Provider } from '@angular/core';

import { ProfilesPermissionsPermissionsRepository } from '@presentation/pages/settings-security/domain/repositories/profiles-permissions/profiles-permissions-permissions-repository';
import { ProfilesPermissionsPermissionsRepositoryImpl } from '@presentation/pages/settings-security/infrastructure/data/repositories/profiles-permissions/profiles-permissions-permissions-repository.impl';

export const profilesPermissionsPermissionsProviders: Provider[] = [
    {
        provide: ProfilesPermissionsPermissionsRepository,
        useClass: ProfilesPermissionsPermissionsRepositoryImpl,
    },
];
