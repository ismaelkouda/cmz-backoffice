import { ReportsEntity } from '@pages/reporting/domain/entities/reports/reports.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

export abstract class ReportRepository {
    abstract getReport(options?: FetchOptions): Observable<ReportsEntity>;
}
