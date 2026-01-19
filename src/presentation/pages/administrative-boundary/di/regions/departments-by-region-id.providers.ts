import { DepartmentsByRegionIdRepository } from "@presentation/pages/administrative-boundary/core/domain/repositories/regions/departments-by-region-id-repository";
import { DepartmentsByRegionIdMapper } from "@presentation/pages/administrative-boundary/infrastructure/data/mappers/regions/departments-by-region-id.mapper";
import { DepartmentsByRegionIdRepositoryImpl } from "@presentation/pages/administrative-boundary/infrastructure/data/repositories/regions/departments-by-region-id.repository.impl";
import { DepartmentsByRegionIdApi } from "@presentation/pages/administrative-boundary/infrastructure/data/sources/regions/departments-by-region-id.api";


export const departmentsByRegionIdProviders = [
    DepartmentsByRegionIdApi,
    DepartmentsByRegionIdMapper,
    { provide: DepartmentsByRegionIdRepository, useClass: DepartmentsByRegionIdRepositoryImpl },
];