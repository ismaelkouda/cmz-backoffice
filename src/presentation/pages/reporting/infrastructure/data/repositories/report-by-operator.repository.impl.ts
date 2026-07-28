import { Injectable, inject } from '@angular/core';
import { ReportByOperatorEntity } from '@pages/reporting/domain/entities/report-by-operator/report-by-operator.entity';
import { ReportByOperatorRepository } from '@pages/reporting/domain/repositories/report-by-operator-repository.interface';
import { ReportByOperatorMapper } from '@pages/reporting/infrastructure/data/mappers/report-by-operator.mapper';
import { ReportByOperatorApi } from '@pages/reporting/infrastructure/data/sources/report-by-operator.api';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReportByOperatorRepositoryImpl implements ReportByOperatorRepository {
    private readonly api = inject(ReportByOperatorApi);
    private readonly reportByOperatorMapper = inject(ReportByOperatorMapper);

    getReportByOperator(
        options?: FetchOptions
    ): Observable<ReportByOperatorEntity> {
        return this.api
            .getReportByOperator(options)
            .pipe(
                map((response) =>
                    this.reportByOperatorMapper.mapFromDto(response)
                )
            );
    }
}
