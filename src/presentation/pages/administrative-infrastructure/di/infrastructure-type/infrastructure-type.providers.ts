import { Provider } from '@angular/core';
import { InfrastructureTypeRepository } from '@presentation/pages/administrative-infrastructure/domain/repositories/infrastructure-type/infrastructure-type.repository';
import { InfrastructureTypeRepositoryImpl } from '@presentation/pages/administrative-infrastructure/infrastructure/data/repositories/infrastructure-type/infrastructure-type.repository.impl';

export const infrastructureTypeProviders: Provider[] = [
    {
        provide: InfrastructureTypeRepository,
        useClass: InfrastructureTypeRepositoryImpl,
    },
];
