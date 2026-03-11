import { DepartmentsRepository } from '@pages/administrative-boundary/domain/repositories/departments/departments-repository';
import { DepartmentsRepositoryImpl } from '@pages/administrative-boundary/infrastructure/data/repositories/departments/departments.repository.impl';

export const provideDepartments = [
    { provide: DepartmentsRepository, useClass: DepartmentsRepositoryImpl },
];
