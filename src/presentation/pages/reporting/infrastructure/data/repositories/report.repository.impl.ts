import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ReportEntity } from '../../../core/domain/entities/report/report.entity';
import { ReportRepository } from '../../../core/domain/repositories/report-repository.interface';
import { ReportMapper } from '../mappers/report.mapper';
import { ReportApi } from '../sources/report.api';

@Injectable({ providedIn: 'root' })
export class ReportRepositoryImpl implements ReportRepository {
    constructor(
        private readonly api: ReportApi,
        private readonly reportMapper: ReportMapper
    ) { }

    getReport(): Observable<ReportEntity> {
        return this.api
            .getReport()
            .pipe(map((response) => this.reportMapper.mapFromDto(response)));
    }
}
