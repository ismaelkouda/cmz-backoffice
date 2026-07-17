import { ReportByOperatorEntity } from '@pages/reporting/domain/entities/report-by-operator/report-by-operator.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

export abstract class ReportByOperatorRepository {
    abstract getReportByOperator(
        options?: FetchOptions
    ): Observable<ReportByOperatorEntity>;
}
