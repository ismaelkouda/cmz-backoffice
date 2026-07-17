import { Provider } from '@angular/core';
import { InfrastructureSelectRepository } from '@presentation/pages/administrative-infrastructure/domain/repositories/infrastructure/infrastructure-select.repository';
import { InfrastructureSelectRepositoryImpl } from '@presentation/pages/administrative-infrastructure/infrastructure/data/repositories/infrastructure/infrastructure-select.repository.impl';

export const infrastructureSelectProviders: Provider[] = [
    {
        provide: InfrastructureSelectRepository,
        useClass: InfrastructureSelectRepositoryImpl,
    },
];
