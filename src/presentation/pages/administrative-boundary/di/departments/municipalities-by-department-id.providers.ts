import { MunicipalitiesByDepartmentIdRepository } from "@presentation/pages/administrative-boundary/core/domain/repositories/departments/municipalities-by-department-id-repository";
import { MunicipalitiesByDepartmentIdMapper } from "@presentation/pages/administrative-boundary/infrastructure/data/mappers/departments/municipalities-by-department-id.mapper";
import { MunicipalitiesByDepartmentIdRepositoryImpl } from "@presentation/pages/administrative-boundary/infrastructure/data/repositories/departments/municipalities-by-department-id.repository.impl";
import { MunicipalitiesByDepartmentIdApi } from "@presentation/pages/administrative-boundary/infrastructure/data/sources/departments/municipalities-by-department-id.api";

export const municipalitiesByDepartmentIdProviders = [
    MunicipalitiesByDepartmentIdApi,
    MunicipalitiesByDepartmentIdMapper,
    { provide: MunicipalitiesByDepartmentIdRepository, useClass: MunicipalitiesByDepartmentIdRepositoryImpl },
];