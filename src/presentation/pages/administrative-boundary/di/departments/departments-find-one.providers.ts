import { DepartmentsFindOneRepository } from '@presentation/pages/administrative-boundary/domain/repositories/departments/departments-find-one-repository';
import { DepartmentsFindOneRepositoryImpl } from '@presentation/pages/administrative-boundary/infrastructure/data/repositories/departments/departments-find-one.repository.impl';

export const provideDepartmentsFindOne = [
    {
        provide: DepartmentsFindOneRepository,
        useClass: DepartmentsFindOneRepositoryImpl,
    },
];
