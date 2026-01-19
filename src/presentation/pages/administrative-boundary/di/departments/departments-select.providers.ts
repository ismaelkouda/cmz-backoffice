import { DepartmentsSelectRepository } from "@presentation/pages/administrative-boundary/core/domain/repositories/departments/departments-select-repository";
import { DepartmentsSelectMapper } from "@presentation/pages/administrative-boundary/infrastructure/data/mappers/departments/departments-select.mapper";
import { DepartmentsSelectRepositoryImpl } from "@presentation/pages/administrative-boundary/infrastructure/data/repositories/departments/departments-select.repository.impl";
import { DepartmentsSelectApi } from "@presentation/pages/administrative-boundary/infrastructure/data/sources/departments/departments-select.api";


export const departmentsSelectProviders = [
    DepartmentsSelectApi,
    DepartmentsSelectMapper,
    { provide: DepartmentsSelectRepository, useClass: DepartmentsSelectRepositoryImpl },
];