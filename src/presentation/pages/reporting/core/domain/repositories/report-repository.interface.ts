import { Observable } from 'rxjs';
import { ReportEntity } from '../entities/report/report.entity';

export abstract class ReportRepository {
    abstract getReport(): Observable<ReportEntity>;
}
