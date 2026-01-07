import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ReportEntity } from '../../../domain/entities/report/report.entity';
import { ReportRepository } from '../../../domain/repositories/report-repository.interface';

@Injectable({
    providedIn: 'root',
})
export class FetchReportUseCase {
    private readonly repository = inject(ReportRepository);

    execute(): Observable<ReportEntity> {
        return this.repository.getReport();
    }
}
