import { Provider } from '@angular/core';
import { ReportsRepository } from '../domain/repositories/reports-repository.interface';
import { ReportsRepositoryImpl } from '../infrastructure/repositories/reports.repository.impl';

export const provideReports: Provider[] = [
    { provide: ReportsRepository, useClass: ReportsRepositoryImpl },
];
