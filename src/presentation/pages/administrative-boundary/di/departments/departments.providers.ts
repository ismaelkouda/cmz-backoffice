import { DepartmentsRepository } from "@presentation/pages/administrative-boundary/core/domain/repositories/departments/departments-repository";
import { DepartmentsMapper } from "@presentation/pages/administrative-boundary/infrastructure/data/mappers/departments/departments.mapper";
import { DepartmentsRepositoryImpl } from "@presentation/pages/administrative-boundary/infrastructure/data/repositories/departments/departments.repository.impl";
import { DepartmentsApi } from "@presentation/pages/administrative-boundary/infrastructure/data/sources/departments/departments.api";

export const provideDepartments = [
    DepartmentsApi,
    DepartmentsMapper,
    { provide: DepartmentsRepository, useClass: DepartmentsRepositoryImpl },
];