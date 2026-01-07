import { inject, Provider } from '@angular/core';
import { EnvService } from '@shared/services/env.service';
import { ReportRepository } from '../core/domain/repositories/report-repository.interface';
import { RequestRepository } from '../core/domain/repositories/request-repository.interface';
import { REPORTING_API_BASE_URL } from '../infrastructure/api/reporting.config';
import { ReportMapper } from '../infrastructure/data/mappers/report.mapper';
import { RequestMapper } from '../infrastructure/data/mappers/request.mapper';
import { ReportRepositoryImpl } from '../infrastructure/data/repositories/report.repository.impl';
import { RequestRepositoryImpl } from '../infrastructure/data/repositories/request.repository.impl';
import { ReportApi } from '../infrastructure/data/sources/report.api';
import { RequestApi } from '../infrastructure/data/sources/request.api';

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
    ReportApi,
    RequestApi,
    ReportMapper,
    RequestMapper,
    { provide: ReportRepository, useClass: ReportRepositoryImpl },
    { provide: RequestRepository, useClass: RequestRepositoryImpl },
];
