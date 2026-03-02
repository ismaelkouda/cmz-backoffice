import { DepartmentsSelectRepository } from '@presentation/pages/administrative-boundary/domain/repositories/departments/departments-select-repository';
import { DepartmentsSelectRepositoryImpl } from '@presentation/pages/administrative-boundary/infrastructure/data/repositories/departments/departments-select.repository.impl';

export const departmentsSelectProviders = [
    {
        provide: DepartmentsSelectRepository,
        useClass: DepartmentsSelectRepositoryImpl,
    },
];
