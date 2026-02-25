import { MunicipalitiesFindOneRepository } from '@presentation/pages/administrative-boundary/domain/repositories/municipalities/municipalities-find-one-repository';
import { MunicipalitiesFindOneRepositoryImpl } from '@presentation/pages/administrative-boundary/infrastructure/data/repositories/municipalities/municipalities-find-one.repository.impl';

export const provideMunicipalitiesFindOne = [
    {
        provide: MunicipalitiesFindOneRepository,
        useClass: MunicipalitiesFindOneRepositoryImpl,
    },
];
