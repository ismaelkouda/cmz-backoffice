import { Injectable, inject } from '@angular/core';
import { ReportsEntity } from '@pages/reporting//domain/entities/reports/reports.entity';
import { ReportRepository } from '@pages/reporting/domain/repositories/report-repository.interface';
import { ReportMapper } from '@pages/reporting/infrastructure/data/mappers/report.mapper';
import { ReportApi } from '@pages/reporting/infrastructure/data/sources/report.api';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReportRepositoryImpl implements ReportRepository {
    private readonly api = inject(ReportApi);
    private readonly reportMapper = inject(ReportMapper);

    getReport(): Observable<ReportsEntity> {
        return this.api
            .getReport()
            .pipe(map((response) => this.reportMapper.mapFromDto(response)));
    }
}
