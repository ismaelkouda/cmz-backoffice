import { DepartmentsFindoneRepository } from "@presentation/pages/administrative-boundary/core/domain/repositories/departments/departments-findone-repository";
import { DepartmentsFindoneMapper } from "@presentation/pages/administrative-boundary/infrastructure/data/mappers/departments/departments-findone.mapper";
import { DepartmentsFindoneRepositoryImpl } from "@presentation/pages/administrative-boundary/infrastructure/data/repositories/departments/departments-findone.repository.impl";
import { DepartmentsFindoneApi } from "@presentation/pages/administrative-boundary/infrastructure/data/sources/departments/departments-findone.api";

export const provideDepartmentsFindone = [
    DepartmentsFindoneApi,
    DepartmentsFindoneMapper,
    { provide: DepartmentsFindoneRepository, useClass: DepartmentsFindoneRepositoryImpl },
];