import { Injectable, inject } from '@angular/core';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { defer, Observable } from 'rxjs';
import {
    Bounds,
    InteractiveMapReport,
    ReportFilters,
} from '@pages/interactive-map/domain/models/interactive-map-report.model';
import { ReportsRepository } from '@pages/interactive-map/domain/repositories/reports-repository.interface';

@Injectable({ providedIn: 'root' })
export class GetReportsUseCase {
    private readonly repository = inject(ReportsRepository);

    execute(
        bounds: Bounds,
        filters: ReportFilters,
        options?: FetchOptions
    ): Observable<InteractiveMapReport[]> {
        return defer(() =>
            this.repository.getReports(bounds, filters, options)
        );
    }
}
