import { Injectable, inject } from '@angular/core';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { InfrastructureImpactStatsResponse } from '@pages/interactive-map/domain/models/interactive-map-report.model';
import { ReportsRepository } from '@pages/interactive-map/domain/repositories/reports-repository.interface';
import { defer, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GetReportInfrastructureStatsUseCase {
    private readonly repository = inject(ReportsRepository);

    execute(
        reportUniqId: string,
        options?: FetchOptions
    ): Observable<InfrastructureImpactStatsResponse> {
        return defer(() =>
            this.repository.getReportInfrastructureStats(reportUniqId, options)
        );
    }
}
