import { Provider } from '@angular/core';
import { InfrastructureTypeSelectRepository } from '@presentation/pages/administrative-infrastructure/domain/repositories/infrastructure-type/infrastructure-type-select.repository';
import { InfrastructureTypeSelectRepositoryImpl } from '@presentation/pages/administrative-infrastructure/infrastructure/data/repositories/infrastructure-type/infrastructure-type-select.repository.impl';

export const infrastructureTypeSelectProviders: Provider[] = [
    {
        provide: InfrastructureTypeSelectRepository,
        useClass: InfrastructureTypeSelectRepositoryImpl,
    },
];
