import { Provider } from '@angular/core';
import { ResponsibilitiesSelectUseCase } from '@presentation/pages/administrative-infrastructure/application/use-cases/infrastructure-type/responsibilities-select.use-case';
import { ResponsibilitiesSelectRepository } from '@presentation/pages/administrative-infrastructure/domain/repositories/infrastructure-type/responsibilities-select-repository';
import { ResponsibilitiesSelectMapper } from '@presentation/pages/administrative-infrastructure/infrastructure/data/mappers/infrastructure-type/responsibilities-select.mapper';
import { ResponsibilitiesSelectRepositoryImpl } from '@presentation/pages/administrative-infrastructure/infrastructure/data/repositories/infrastructure-type/responsibilities-select-repository.impl';
import { ResponsibilitiesSelectApi } from '@presentation/pages/administrative-infrastructure/infrastructure/data/sources/infrastructure-type/responsibilities-select.api';

export const responsibilitiesSelectProviders: Provider[] = [
    ResponsibilitiesSelectApi,
    ResponsibilitiesSelectMapper,
    ResponsibilitiesSelectUseCase,
    {
        provide: ResponsibilitiesSelectRepository,
        useClass: ResponsibilitiesSelectRepositoryImpl,
    },
];
