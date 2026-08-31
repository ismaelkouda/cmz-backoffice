import { Provider } from '@angular/core';
import { ReportRepository } from '@pages/reporting/domain/repositories/report-repository.interface';
import { RequestRepository } from '@pages/reporting/domain/repositories/request-repository.interface';
import { ReportByChannelRepository } from '@pages/reporting/domain/repositories/report-by-channel-repository.interface';
import { ReportByOperatorRepository } from '@pages/reporting/domain/repositories/report-by-operator-repository.interface';
import { ReportByEquipmentsRepository } from '@pages/reporting/domain/repositories/report-by-equipments-repository.interface';
import { ReportByPopulationsRepository } from '@pages/reporting/domain/repositories/report-by-populations-repository.interface';
import { ReportRepositoryImpl } from '@pages/reporting/infrastructure/data/repositories/reports.repository.impl';
import { RequestRepositoryImpl } from '@pages/reporting/infrastructure/data/repositories/requests.repository.impl';
import { ReportByChannelRepositoryImpl } from '@pages/reporting/infrastructure/data/repositories/report-by-channel.repository.impl';
import { ReportByOperatorRepositoryImpl } from '@pages/reporting/infrastructure/data/repositories/report-by-operator.repository.impl';
import { ReportByEquipmentsRepositoryImpl } from '@pages/reporting/infrastructure/data/repositories/report-by-equipments.repository.impl';
import { ReportByPopulationsRepositoryImpl } from '@pages/reporting/infrastructure/data/repositories/report-by-populations.repository.impl';

export const provideReporting = (): Provider[] => [
    { provide: ReportRepository, useClass: ReportRepositoryImpl },
    { provide: RequestRepository, useClass: RequestRepositoryImpl },
    {
        provide: ReportByChannelRepository,
        useClass: ReportByChannelRepositoryImpl,
    },
    {
        provide: ReportByOperatorRepository,
        useClass: ReportByOperatorRepositoryImpl,
    },
    {
        provide: ReportByEquipmentsRepository,
        useClass: ReportByEquipmentsRepositoryImpl,
    },
    {
        provide: ReportByPopulationsRepository,
        useClass: ReportByPopulationsRepositoryImpl,
    },
];
