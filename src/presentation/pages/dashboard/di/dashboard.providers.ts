import { Provider } from '@angular/core';
import { DashboardMapper } from '@pages/dashboard/data/mappers/dashboard.mapper';
import { DashboardRepositoryImpl } from '@pages/dashboard/data/repositories/dashboard.repository.impl';
import { DashboardApi } from '@pages/dashboard/data/sources/dashboard.api';
import { DashboardRepository } from '@pages/dashboard/domain/repositories/dashboard.repository';

export function provideDashboard(): Provider[] {
    return [
        DashboardApi,
        DashboardMapper,
        DashboardRepositoryImpl,
        {
            provide: DashboardRepository,
            useExisting: DashboardRepositoryImpl,
        },
    ];
}

