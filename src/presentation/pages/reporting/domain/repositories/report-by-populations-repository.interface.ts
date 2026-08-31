import { ReportByPopulationsEntity } from '@pages/reporting/domain/entities/report-by-populations/report-by-populations.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

export abstract class ReportByPopulationsRepository {
    abstract getReportByPopulations(
        options?: FetchOptions
    ): Observable<ReportByPopulationsEntity>;
}
