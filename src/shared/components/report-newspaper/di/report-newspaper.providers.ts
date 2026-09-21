import { Provider } from '@angular/core';
import { ReportNewspaperRepository } from '@shared/components/report-newspaper/domain/repositories/report-newspaper-repository';
import { ReportNewspaperRepositoryImpl } from '@shared/components/report-newspaper/infrastructure/data/repositories/report-newspaper-repository.impl';

export const provideReportNewspaper = (): Provider[] => [
    {
        provide: ReportNewspaperRepository,
        useClass: ReportNewspaperRepositoryImpl,
    },
];
