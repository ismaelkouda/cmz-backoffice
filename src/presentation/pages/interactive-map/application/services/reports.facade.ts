import { Injectable, inject } from '@angular/core';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';
import { ReportsBus } from '@pages/interactive-map/application/queries-bus/reports/reports.bus';
import {
    Bounds,
    CoverageAreaFilters,
    InfrastructureImpactStatsResponse,
    InteractiveMapReport,
    ReportFilters,
    ReportStatus,
} from '@pages/interactive-map/domain/models/interactive-map-report.model';

@Injectable({ providedIn: 'root' })
export class ReportsFacade {
    private readonly bus = inject(ReportsBus);

    getReports(
        bounds: Bounds,
        filters: ReportFilters,
        options?: FetchOptions
    ): Observable<InteractiveMapReport[]> {
        return this.bus.dispatchGetReports(bounds, filters, options);
    }

    updateStatus(
        reportId: string | number,
        status: ReportStatus
    ): Observable<InteractiveMapReport> {
        return this.bus.dispatchUpdateStatus(reportId, status);
    }

    getCoverageAreasTileUrl(filters: CoverageAreaFilters): string {
        return this.bus.dispatchGetCoverageAreasTileUrl(filters);
    }

    getInfrastructureTilesUrl(typeEquipment: string | string[]): string {
        return this.bus.dispatchGetInfrastructureTilesUrl(typeEquipment);
    }

    getReportInfrastructureTilesUrl(
        reportUniqId: string,
        typeEquipment: string | string[]
    ): string {
        return this.bus.dispatchGetReportInfrastructureTilesUrl(
            reportUniqId,
            typeEquipment
        );
    }

    getReportInfrastructureStats(
        reportUniqId: string,
        options?: FetchOptions
    ): Observable<InfrastructureImpactStatsResponse> {
        return this.bus.dispatchGetReportInfrastructureStats(
            reportUniqId,
            options
        );
    }
}
