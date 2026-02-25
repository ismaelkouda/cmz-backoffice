import { RegionsSelectRepository } from '@presentation/pages/administrative-boundary/domain/repositories/regions/regions-select-repository';
import { RegionsSelectRepositoryImpl } from '@presentation/pages/administrative-boundary/infrastructure/data/repositories/regions/regions-select.repository.impl';

export const regionsSelectProviders = [
    { provide: RegionsSelectRepository, useClass: RegionsSelectRepositoryImpl },
];
