import { ReportsEntity } from '@pages/reporting/domain/entities/reports/reports.entity';
import { Observable } from 'rxjs';

export abstract class ReportRepository {
    abstract getReport(): Observable<ReportsEntity>;
}
