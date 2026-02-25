import { DepartmentsRepository } from '@presentation/pages/administrative-boundary/domain/repositories/departments/departments-repository';
import { DepartmentsRepositoryImpl } from '@presentation/pages/administrative-boundary/infrastructure/data/repositories/departments/departments.repository.impl';

export const provideDepartments = [
    { provide: DepartmentsRepository, useClass: DepartmentsRepositoryImpl },
];
