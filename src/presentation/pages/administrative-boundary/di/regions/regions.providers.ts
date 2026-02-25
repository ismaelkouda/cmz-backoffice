import { RegionsRepository } from '@presentation/pages/administrative-boundary/domain/repositories/regions/regions-repository';
import { RegionsRepositoryImpl } from '@presentation/pages/administrative-boundary/infrastructure/data/repositories/regions/regions.repository.impl';

export const provideRegions = [
    { provide: RegionsRepository, useClass: RegionsRepositoryImpl },
];
