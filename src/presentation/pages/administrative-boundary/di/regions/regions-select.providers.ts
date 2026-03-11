import { RegionsSelectRepository } from '@pages/administrative-boundary/domain/repositories/regions/regions-select-repository';
import { RegionsSelectRepositoryImpl } from '@pages/administrative-boundary/infrastructure/data/repositories/regions/regions-select.repository.impl';

export const regionsSelectProviders = [
    { provide: RegionsSelectRepository, useClass: RegionsSelectRepositoryImpl },
];
