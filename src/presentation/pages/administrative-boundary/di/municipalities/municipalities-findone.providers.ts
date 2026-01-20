import { MunicipalitiesFindoneRepository } from "@presentation/pages/administrative-boundary/core/domain/repositories/municipalities/municipalities-findone-repository";
import { MunicipalitiesFindoneMapper } from "@presentation/pages/administrative-boundary/infrastructure/data/mappers/municipalities/municipalities-findone.mapper";
import { MunicipalitiesFindoneRepositoryImpl } from "@presentation/pages/administrative-boundary/infrastructure/data/repositories/municipalities/municipalities-findone.repository.impl";
import { MunicipalitiesFindoneApi } from "@presentation/pages/administrative-boundary/infrastructure/data/sources/municipalities/municipalities-findone.api";

export const provideMunicipalitiesFindone = [
    MunicipalitiesFindoneApi,
    MunicipalitiesFindoneMapper,
    { provide: MunicipalitiesFindoneRepository, useClass: MunicipalitiesFindoneRepositoryImpl },
];