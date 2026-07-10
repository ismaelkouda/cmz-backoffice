import { Provider } from '@angular/core';
import { InfrastructureTypeFindOneUseCase } from '@presentation/pages/administrative-infrastructure/application/use-cases/infrastructure-type/infrastructure-type-find-one.use-case';
import { InfrastructureTypeFindOneRepository } from '@presentation/pages/administrative-infrastructure/domain/repositories/infrastructure-type/infrastructure-type-find-one-repository';
import { InfrastructureTypeFindOneMapper } from '@presentation/pages/administrative-infrastructure/infrastructure/data/mappers/infrastructure-type/infrastructure-type-find-one.mapper';
import { InfrastructureTypeFindOneRepositoryImpl } from '@presentation/pages/administrative-infrastructure/infrastructure/data/repositories/infrastructure-type/infrastructure-type-find-one-repository.impl';
import { InfrastructureTypeFindOneApi } from '@presentation/pages/administrative-infrastructure/infrastructure/data/sources/infrastructure-type/infrastructure-type-find-one.api';

export const infrastructureTypeFindOneProviders: Provider[] = [
    InfrastructureTypeFindOneApi,
    InfrastructureTypeFindOneMapper,
    InfrastructureTypeFindOneUseCase,
    {
        provide: InfrastructureTypeFindOneRepository,
        useClass: InfrastructureTypeFindOneRepositoryImpl,
    },
];
