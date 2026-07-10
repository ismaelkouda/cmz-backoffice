import { Provider } from '@angular/core';
import { InfrastructureFindOneUseCase } from '@presentation/pages/administrative-infrastructure/application/use-cases/infrastructure/infrastructure-find-one.use-case';
import { InfrastructureFindOneRepository } from '@presentation/pages/administrative-infrastructure/domain/repositories/infrastructure/infrastructure-find-one-repository';
import { InfrastructureFindOneMapper } from '@presentation/pages/administrative-infrastructure/infrastructure/data/mappers/infrastructure/infrastructure-find-one.mapper';
import { InfrastructureFindOneRepositoryImpl } from '@presentation/pages/administrative-infrastructure/infrastructure/data/repositories/infrastructure/infrastructure-find-one-repository.impl';
import { InfrastructureFindOneApi } from '@presentation/pages/administrative-infrastructure/infrastructure/data/sources/infrastructure/infrastructure-find-one.api';

export const infrastructureFindOneProviders: Provider[] = [
    InfrastructureFindOneApi,
    InfrastructureFindOneMapper,
    InfrastructureFindOneUseCase,
    {
        provide: InfrastructureFindOneRepository,
        useClass: InfrastructureFindOneRepositoryImpl,
    },
];
