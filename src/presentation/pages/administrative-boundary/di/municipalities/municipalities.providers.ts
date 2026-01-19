import { MunicipalitiesRepository } from "@presentation/pages/administrative-boundary/core/domain/repositories/municipalities/municipalities-repository";
import { MunicipalitiesMapper } from "@presentation/pages/administrative-boundary/infrastructure/data/mappers/municipalities/municipalities.mapper";
import { MunicipalitiesRepositoryImpl } from "@presentation/pages/administrative-boundary/infrastructure/data/repositories/municipalities/municipalities.repository.impl";
import { MunicipalitiesApi } from "@presentation/pages/administrative-boundary/infrastructure/data/sources/municipalities/municipalities.api";

export const provideMunicipalities = [
    MunicipalitiesApi,
    MunicipalitiesMapper,
    { provide: MunicipalitiesRepository, useClass: MunicipalitiesRepositoryImpl },
];