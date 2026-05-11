import { inject, Provider } from '@angular/core';
import { DashboardRepository } from '@pages/dashboard/domain/repositories/dashboard.repository';
import { DASHBOARD_BASE_URL } from '@pages/dashboard/infrastructure/api/dashboard.base-url';
import { DashboardRepositoryImpl } from '@pages/dashboard/infrastructure/data/repositories/dashboard-repository.impl';

import { EnvService } from '../../../../core/config/env.service';

const getApiBaseUrl = () => {
    const baseUrl = inject(EnvService).reportUrl;

    if (!baseUrl) {
        console.warn(
            'finalization Module: API Base URL is missing in environment configuration.'
        );
    }

    return baseUrl;
};

export const provideDashboard = (): Provider[] => [
    {
        provide: DASHBOARD_BASE_URL,
        useFactory: getApiBaseUrl,
    },
    {
        provide: DashboardRepository,
        useExisting: DashboardRepositoryImpl,
    },
];
