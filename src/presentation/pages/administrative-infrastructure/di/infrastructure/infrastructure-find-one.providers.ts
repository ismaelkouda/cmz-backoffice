import { Provider } from '@angular/core';
import { InfrastructureFindOneRepository } from '@presentation/pages/administrative-infrastructure/domain/repositories/infrastructure/infrastructure-find-one.repository';
import { InfrastructureFindOneRepositoryImpl } from '@presentation/pages/administrative-infrastructure/infrastructure/data/repositories/infrastructure/infrastructure-find-one.repository.impl';

export const infrastructureFindOneProviders: Provider[] = [
    {
        provide: InfrastructureFindOneRepository,
        useClass: InfrastructureFindOneRepositoryImpl,
    },
];
