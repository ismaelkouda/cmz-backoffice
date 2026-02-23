import { Provider } from '@angular/core';

import { ResponsibilitiesSelectUseCase } from '@presentation/pages/settings-security/application/use-cases/users/responsibilities-select.use-case';
import { ResponsibilitiesSelectRepository } from '@presentation/pages/settings-security/domain/repositories/users/responsibilities-select-repository';
import { ResponsibilitiesSelectMapper } from '@presentation/pages/settings-security/infrastructure/data/mappers/users/responsibilities-select.mapper';
import { ResponsibilitiesSelectRepositoryImpl } from '@presentation/pages/settings-security/infrastructure/data/repositories/users/responsibilities-select-repository.impl';
import { ResponsibilitiesSelectApi } from '@presentation/pages/settings-security/infrastructure/data/sources/users/responsibilities-select.api';

export const responsibilitiesSelectProviders: Provider[] = [
    ResponsibilitiesSelectApi,
    ResponsibilitiesSelectMapper,
    ResponsibilitiesSelectUseCase,
    {
        provide: ResponsibilitiesSelectRepository,
        useClass: ResponsibilitiesSelectRepositoryImpl,
    },
];
