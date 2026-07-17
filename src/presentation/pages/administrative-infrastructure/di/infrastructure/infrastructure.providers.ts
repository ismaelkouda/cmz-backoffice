import { Provider } from '@angular/core';
import { InfrastructureRepository } from '@presentation/pages/administrative-infrastructure/domain/repositories/infrastructure/infrastructure.repository';
import { InfrastructureRepositoryImpl } from '@presentation/pages/administrative-infrastructure/infrastructure/data/repositories/infrastructure/infrastructure.repository.impl';

export const infrastructureProviders: Provider[] = [
    {
        provide: InfrastructureRepository,
        useClass: InfrastructureRepositoryImpl,
    },
];
