import { Provider } from '@angular/core';

import { ProfilesSelectUseCase } from '@presentation/pages/settings-security/core/application/use-cases/users/profiles-select.use-case';
import { ProfilesSelectRepository } from '@presentation/pages/settings-security/core/domain/repositories/users/profiles-select-repository';
import { ProfilesSelectMapper } from '@presentation/pages/settings-security/infrastructure/data/mappers/users/profiles-select.mapper';
import { ProfilesSelectRepositoryImpl } from '@presentation/pages/settings-security/infrastructure/data/repositories/users/profiles-select-repository.impl';
import { ProfilesSelectApi } from '@presentation/pages/settings-security/infrastructure/data/sources/users/profiles-select.api';

export const profilesSelectProviders: Provider[] = [
    ProfilesSelectApi,
    ProfilesSelectMapper,
    ProfilesSelectUseCase,
    {
        provide: ProfilesSelectRepository,
        useClass: ProfilesSelectRepositoryImpl,
    },
];
