import { MunicipalitiesByDepartmentIdRepository } from '@pages/administrative-boundary/domain/repositories/departments/municipalities-by-department-id-repository';
import { MunicipalitiesByDepartmentIdRepositoryImpl } from '@pages/administrative-boundary/infrastructure/data/repositories/departments/municipalities-by-department-id.repository.impl';

export const municipalitiesByDepartmentIdProviders = [
    {
        provide: MunicipalitiesByDepartmentIdRepository,
        useClass: MunicipalitiesByDepartmentIdRepositoryImpl,
    },
];
