import { Injectable, inject } from '@angular/core';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';
import {
    Bounds,
    CoverageAreaFilters,
    InfrastructureImpactStatsResponse,
    InteractiveMapReport,
    ReportFilters,
    ReportStatus,
} from '../../domain/models/interactive-map-report.model';
import { ReportsRepository } from '../../domain/repositories/reports-repository.interface';
import { InteractiveMapReportsApi } from '../data/sources/interactive-map-reports.api';

@Injectable({ providedIn: 'root' })
export class ReportsRepositoryImpl implements ReportsRepository {
    private readonly api = inject(InteractiveMapReportsApi);

    getReports(
        bounds: Bounds,
        filters: ReportFilters,
        options?: FetchOptions
    ): Observable<InteractiveMapReport[]> {
        return this.api.getReports(bounds, filters, 1, 500, options);
    }

    updateStatus(
        reportId: string | number,
        status: ReportStatus
    ): Observable<InteractiveMapReport> {
        return this.api.updateStatus(reportId, status);
    }

    getCoverageAreasTileUrl(filters: CoverageAreaFilters): string {
        return this.api.getCoverageAreasTileUrl(filters);
    }

    getInfrastructureTilesUrl(typeEquipment: string | string[]): string {
        return this.api.getInfrastructureTilesUrl(typeEquipment);
    }

    getReportInfrastructureTilesUrl(
        reportUniqId: string,
        typeEquipment: string | string[]
    ): string {
        return this.api.getReportInfrastructureTilesUrl(
            reportUniqId,
            typeEquipment
        );
    }

    getReportInfrastructureStats(
        reportUniqId: string,
        options?: FetchOptions
    ): Observable<InfrastructureImpactStatsResponse> {
        return this.api.getReportInfrastructureStats(reportUniqId, options);
    }
}
