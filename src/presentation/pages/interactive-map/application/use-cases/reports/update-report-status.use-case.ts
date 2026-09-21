import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
    InteractiveMapReport,
    ReportStatus,
} from '@pages/interactive-map/domain/models/interactive-map-report.model';
import { ReportsRepository } from '@pages/interactive-map/domain/repositories/reports-repository.interface';

@Injectable({ providedIn: 'root' })
export class UpdateReportStatusUseCase {
    private readonly repository = inject(ReportsRepository);

    execute(
        reportId: string | number,
        status: ReportStatus
    ): Observable<InteractiveMapReport> {
        return this.repository.updateStatus(reportId, status);
    }
}
