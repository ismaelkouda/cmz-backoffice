import { Injectable, inject } from '@angular/core';
import { ReportByPopulationsEntity } from '@pages/reporting/domain/entities/report-by-populations/report-by-populations.entity';
import { ReportByPopulationsRepository } from '@pages/reporting/domain/repositories/report-by-populations-repository.interface';
import { ReportByPopulationsMapper } from '@pages/reporting/infrastructure/data/mappers/report-by-populations.mapper';
import { ReportByPopulationsApi } from '@pages/reporting/infrastructure/data/sources/report-by-populations.api';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReportByPopulationsRepositoryImpl implements ReportByPopulationsRepository {
    private readonly api = inject(ReportByPopulationsApi);
    private readonly reportByPopulationsMapper = inject(
        ReportByPopulationsMapper
    );

    getReportByPopulations(
        options?: FetchOptions
    ): Observable<ReportByPopulationsEntity> {
        return this.api
            .getReportByPopulations(options)
            .pipe(
                map((response) =>
                    this.reportByPopulationsMapper.mapFromDto(response)
                )
            );
    }
}
