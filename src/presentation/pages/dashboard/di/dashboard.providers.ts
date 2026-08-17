import { Provider } from '@angular/core';
import { DashboardRepository } from '@pages/dashboard/domain/repositories/dashboard.repository';
import { DashboardRepositoryImpl } from '@pages/dashboard/infrastructure/data/repositories/dashboard-repository.impl';

export const provideDashboard = (): Provider[] => [
    {
        provide: DashboardRepository,
        useExisting: DashboardRepositoryImpl,
    },
];
