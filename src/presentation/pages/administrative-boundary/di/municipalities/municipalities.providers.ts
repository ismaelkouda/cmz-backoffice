import { MunicipalitiesRepository } from '@pages/administrative-boundary/domain/repositories/municipalities/municipalities-repository';
import { MunicipalitiesRepositoryImpl } from '@pages/administrative-boundary/infrastructure/data/repositories/municipalities/municipalities.repository.impl';

export const provideMunicipalities = [
    {
        provide: MunicipalitiesRepository,
        useClass: MunicipalitiesRepositoryImpl,
    },
];
