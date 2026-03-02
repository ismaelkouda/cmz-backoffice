import { RegionsFindOneRepository } from '@presentation/pages/administrative-boundary/domain/repositories/regions/regions-find-one-repository';
import { RegionsFindOneRepositoryImpl } from '@presentation/pages/administrative-boundary/infrastructure/data/repositories/regions/regions-find-one.repository.impl';

export const provideRegionsFindOne = [
    {
        provide: RegionsFindOneRepository,
        useClass: RegionsFindOneRepositoryImpl,
    },
];
