import { Injectable, inject } from '@angular/core';
import { ReportRepository } from '@pages/reporting/domain/repositories/report-repository.interface';
import { ReportsEntity } from '@presentation/pages/reporting/domain/entities/reports/reports.entity';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ReportsUseCase {
    private readonly repository = inject(ReportRepository);

    execute(): Observable<ReportsEntity> {
        return this.repository.getReport();
    }
}
