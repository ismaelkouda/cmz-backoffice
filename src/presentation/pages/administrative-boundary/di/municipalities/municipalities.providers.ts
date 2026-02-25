import { MunicipalitiesRepository } from '@presentation/pages/administrative-boundary/domain/repositories/municipalities/municipalities-repository';
import { MunicipalitiesRepositoryImpl } from '@presentation/pages/administrative-boundary/infrastructure/data/repositories/municipalities/municipalities.repository.impl';

export const provideMunicipalities = [
    {
        provide: MunicipalitiesRepository,
        useClass: MunicipalitiesRepositoryImpl,
    },
];
