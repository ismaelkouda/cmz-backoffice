import { Injectable, inject } from '@angular/core';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';
import { GetCoverageAreasTileUrlUseCase } from '@pages/interactive-map/application/use-cases/reports/get-coverage-areas-tile-url.use-case';
import { GetInfrastructureTilesUrlUseCase } from '@pages/interactive-map/application/use-cases/reports/get-infrastructure-tiles-url.use-case';
import { GetReportInfrastructureStatsUseCase } from '@pages/interactive-map/application/use-cases/reports/get-report-infrastructure-stats.use-case';
import { GetReportsUseCase } from '@pages/interactive-map/application/use-cases/reports/get-reports.use-case';
import { UpdateReportStatusUseCase } from '@pages/interactive-map/application/use-cases/reports/update-report-status.use-case';
import {
    Bounds,
    CoverageAreaFilters,
    InfrastructureImpactStatsResponse,
    InteractiveMapReport,
    ReportFilters,
    ReportStatus,
} from '@pages/interactive-map/domain/models/interactive-map-report.model';

@Injectable({ providedIn: 'root' })
export class ReportsHandler {
    private readonly getReportsUseCase = inject(GetReportsUseCase);
    private readonly updateReportStatusUseCase = inject(
        UpdateReportStatusUseCase
    );
    private readonly getCoverageAreasTileUrlUseCase = inject(
        GetCoverageAreasTileUrlUseCase
    );
    private readonly getInfrastructureTilesUrlUseCase = inject(
        GetInfrastructureTilesUrlUseCase
    );
    private readonly getReportInfrastructureStatsUseCase = inject(
        GetReportInfrastructureStatsUseCase
    );

    getReports(
        bounds: Bounds,
        filters: ReportFilters,
        options?: FetchOptions
    ): Observable<InteractiveMapReport[]> {
        return this.getReportsUseCase.execute(bounds, filters, options);
    }

    updateStatus(
        reportId: string | number,
        status: ReportStatus
    ): Observable<InteractiveMapReport> {
        return this.updateReportStatusUseCase.execute(reportId, status);
    }

    getCoverageAreasTileUrl(filters: CoverageAreaFilters): string {
        return this.getCoverageAreasTileUrlUseCase.execute(filters);
    }

    getInfrastructureTilesUrl(typeEquipment: string | string[]): string {
        return this.getInfrastructureTilesUrlUseCase.execute(typeEquipment);
    }

    getReportInfrastructureTilesUrl(
        reportUniqId: string,
        typeEquipment: string | string[]
    ): string {
        return this.getInfrastructureTilesUrlUseCase.executeScoped(
            reportUniqId,
            typeEquipment
        );
    }

    getReportInfrastructureStats(
        reportUniqId: string,
        options?: FetchOptions
    ): Observable<InfrastructureImpactStatsResponse> {
        return this.getReportInfrastructureStatsUseCase.execute(
            reportUniqId,
            options
        );
    }
}
