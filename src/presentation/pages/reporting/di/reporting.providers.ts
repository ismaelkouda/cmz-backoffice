import { Provider } from '@angular/core';
import { ReportRepository } from '@pages/reporting/domain/repositories/report-repository.interface';
import { RequestRepository } from '@pages/reporting/domain/repositories/request-repository.interface';
import { ReportRepositoryImpl } from '@pages/reporting/infrastructure/data/repositories/reports.repository.impl';
import { RequestRepositoryImpl } from '@pages/reporting/infrastructure/data/repositories/requests.repository.impl';

export const provideReporting = (): Provider[] => [
    { provide: ReportRepository, useClass: ReportRepositoryImpl },
    { provide: RequestRepository, useClass: RequestRepositoryImpl },
];
