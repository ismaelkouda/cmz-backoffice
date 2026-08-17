import { Injectable, inject } from '@angular/core';
import { ReportsEntity } from '@pages/reporting/domain/entities/reports/reports.entity';
import { ReportRepository } from '@pages/reporting/domain/repositories/report-repository.interface';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ReportsUseCase {
    private readonly repository = inject(ReportRepository);

    execute(options?: FetchOptions): Observable<ReportsEntity> {
        return this.repository.getReport(options);
    }
}
