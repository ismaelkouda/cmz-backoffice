import { Observable } from 'rxjs';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import {
    Bounds,
    CoverageAreaFilters,
    InfrastructureImpactStatsResponse,
    InteractiveMapReport,
    ReportFilters,
    ReportStatus,
} from '../models/interactive-map-report.model';

export abstract class ReportsRepository {
    abstract getReports(
        bounds: Bounds,
        filters: ReportFilters,
        options?: FetchOptions
    ): Observable<InteractiveMapReport[]>;

    abstract updateStatus(
        reportId: string | number,
        status: ReportStatus
    ): Observable<InteractiveMapReport>;

    abstract getCoverageAreasTileUrl(filters: CoverageAreaFilters): string;

    abstract getInfrastructureTilesUrl(
        typeEquipment: string | string[]
    ): string;

    abstract getReportInfrastructureTilesUrl(
        reportUniqId: string,
        typeEquipment: string | string[]
    ): string;

    abstract getReportInfrastructureStats(
        reportUniqId: string,
        options?: FetchOptions
    ): Observable<InfrastructureImpactStatsResponse>;
}
