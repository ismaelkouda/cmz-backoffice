import { MunicipalitiesSelectRepository } from '@pages/administrative-boundary/domain/repositories/municipalities/municipalities-select-repository';
import { MunicipalitiesSelectRepositoryImpl } from '@pages/administrative-boundary/infrastructure/data/repositories/municipalities/municipalities-select.repository.impl';

export const municipalitiesSelectProviders = [
    {
        provide: MunicipalitiesSelectRepository,
        useClass: MunicipalitiesSelectRepositoryImpl,
    },
];
