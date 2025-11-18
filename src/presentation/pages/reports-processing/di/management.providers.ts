import { Provider } from '@angular/core';
import { ManagementRepositoryImpl } from '../data/repositories/management.repository.impl';
import { ManagementApi } from '../data/sources/management.api';
import { ManagementRepository } from '../domain/repositories/management.repository';

export function provideManagement(): Provider[] {
    return [
        ManagementApi,
        ManagementRepositoryImpl,
        {
            provide: ManagementRepository,
            useExisting: ManagementRepositoryImpl,
        },
    ];
}
