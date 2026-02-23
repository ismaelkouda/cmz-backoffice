import { Provider } from '@angular/core';

import { ProfilesPermissionsRepository } from '@presentation/pages/settings-security/domain/repositories/profiles-permissions/profiles-permissions-repository';
import { ProfilesPermissionsRepositoryImpl } from '@presentation/pages/settings-security/infrastructure/data/repositories/profiles-permissions/profiles-permissions-repository.impl';

export const profilesPermissionsProviders: Provider[] = [
    {
        provide: ProfilesPermissionsRepository,
        useClass: ProfilesPermissionsRepositoryImpl,
    },
];
