import { inject, Provider } from '@angular/core';
import { ReportRepository } from '@pages/reporting/domain/repositories/report-repository.interface';
import { RequestRepository } from '@pages/reporting/domain/repositories/request-repository.interface';
import { REPORTING_API_BASE_URL } from '@pages/reporting/infrastructure/api/reporting.config';
import { ReportRepositoryImpl } from '@pages/reporting/infrastructure/data/repositories/reports.repository.impl';
import { RequestRepositoryImpl } from '@pages/reporting/infrastructure/data/repositories/requests.repository.impl';
import { EnvService } from '@shared/domain/services/env.service';

const getApiBaseUrl = (): string => {
    const baseUrl = inject(EnvService).settingUrl;

    if (!baseUrl) {
        console.warn(
            'Reporting Module: API Base URL is missing in environment configuration.'
        );
    }

    return baseUrl;
};

export const provideReporting = (): Provider[] => [
    {
        provide: REPORTING_API_BASE_URL,
        useFactory: getApiBaseUrl,
    },
    { provide: ReportRepository, useClass: ReportRepositoryImpl },
    { provide: RequestRepository, useClass: RequestRepositoryImpl },
];
