import { DepartmentsByRegionIdRepository } from '@presentation/pages/administrative-boundary/domain/repositories/regions/departments-by-region-id-repository';
import { DepartmentsByRegionIdRepositoryImpl } from '@presentation/pages/administrative-boundary/infrastructure/data/repositories/regions/departments-by-region-id.repository.impl';

export const departmentsByRegionIdProviders = [
    {
        provide: DepartmentsByRegionIdRepository,
        useClass: DepartmentsByRegionIdRepositoryImpl,
    },
];
