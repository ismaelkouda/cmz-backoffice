import { Injectable, inject } from '@angular/core';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';
import { ReportsHandler } from '@pages/interactive-map/application/queries-handlers/reports/reports.handler';
import {
    Bounds,
    CoverageAreaFilters,
    InfrastructureImpactStatsResponse,
    InteractiveMapReport,
    ReportFilters,
    ReportStatus,
} from '@pages/interactive-map/domain/models/interactive-map-report.model';

@Injectable({ providedIn: 'root' })
export class ReportsBus {
    private readonly handler = inject(ReportsHandler);

    dispatchGetReports(
        bounds: Bounds,
        filters: ReportFilters,
        options?: FetchOptions
    ): Observable<InteractiveMapReport[]> {
        return this.handler.getReports(bounds, filters, options);
    }

    dispatchUpdateStatus(
        reportId: string | number,
        status: ReportStatus
    ): Observable<InteractiveMapReport> {
        return this.handler.updateStatus(reportId, status);
    }

    dispatchGetCoverageAreasTileUrl(filters: CoverageAreaFilters): string {
        return this.handler.getCoverageAreasTileUrl(filters);
    }

    dispatchGetInfrastructureTilesUrl(
        typeEquipment: string | string[]
    ): string {
        return this.handler.getInfrastructureTilesUrl(typeEquipment);
    }

    dispatchGetReportInfrastructureTilesUrl(
        reportUniqId: string,
        typeEquipment: string | string[]
    ): string {
        return this.handler.getReportInfrastructureTilesUrl(
            reportUniqId,
            typeEquipment
        );
    }

    dispatchGetReportInfrastructureStats(
        reportUniqId: string,
        options?: FetchOptions
    ): Observable<InfrastructureImpactStatsResponse> {
        return this.handler.getReportInfrastructureStats(reportUniqId, options);
    }
}
