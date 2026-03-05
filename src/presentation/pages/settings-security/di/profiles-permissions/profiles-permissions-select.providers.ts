import { Provider } from '@angular/core';

import { ProfilesPermissionsSelectRepository } from '@presentation/pages/settings-security/domain/repositories/profiles-permissions/profiles-permissions-select-repository';
import { ProfilesPermissionsSelectRepositoryImpl } from '@presentation/pages/settings-security/infrastructure/data/repositories/profiles-permissions/profiles-permissions-select-repository.impl';

export const profilesPermissionsSelectProviders: Provider[] = [
    {
        provide: ProfilesPermissionsSelectRepository,
        useClass: ProfilesPermissionsSelectRepositoryImpl,
    },
];
