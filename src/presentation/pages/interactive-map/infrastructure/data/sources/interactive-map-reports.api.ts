import { HttpClient } from '@angular/common/http';
import { Injectable, signal, inject } from '@angular/core';
import {
    Bounds,
    CoverageAreaFilters,
    CoverageAreaGeoJson,
    InteractiveMapReport,
    ReportFilters,
    ReportOperator,
    ReportStatus,
    ReportType,
    ReportsResponse,
} from '@pages/interactive-map/domain/models/interactive-map-report.model';
import { INTERACTIVE_MAP_ENDPOINTS } from '@pages/interactive-map/infrastructure/api/interactive-map.endpoints';
import { REPORT_API_URL, SETTINGS_API_URL } from '@core/config/config.tokens';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InteractiveMapReportsApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(REPORT_API_URL);
    private readonly settingsBaseUrl = inject(SETTINGS_API_URL);

    private readonly reportsSignal = signal<InteractiveMapReport[]>([]);

    readonly reports = this.reportsSignal.asReadonly();

    getReports(
        bounds: Bounds,
        filters: ReportFilters,
        page = 1,
        perPage = 500
    ): Observable<InteractiveMapReport[]> {
        const params = this.buildQueryParams(bounds, filters, page, perPage);
        console.log('filters: ', filters);
        const url = `${this.baseUrl}${INTERACTIVE_MAP_ENDPOINTS.REPORTS}`;

        return this.http.get<ReportsResponse>(url, { params }).pipe(
            map((response) => response.data.data || []),
            map((reports) => reports.filter((item) => !item.is_duplicated)),
            // map((reports) => this.applyClientFilters(reports, filters)),
            map((reports) => {
                this.reportsSignal.set(reports);
                return reports;
            })
        );
    }

    getCoverageAreasGeoJson(
        bounds: Bounds,
        filters: CoverageAreaFilters
    ): Observable<CoverageAreaGeoJson> {
        const params = this.buildCoverageAreaParams(bounds, filters);
        const url = `${this.baseUrl}${INTERACTIVE_MAP_ENDPOINTS.COVERAGE_AREAS_GEOJSON}`;

        return this.http.get<CoverageAreaGeoJson>(url, { params });
    }

    getCoverageAreasTileUrl(filters: CoverageAreaFilters): string {
        const params = this.buildCoverageAreaTileParams(filters);
        const query = new URLSearchParams(params).toString();
        const baseUrl = `${this.baseUrl}${INTERACTIVE_MAP_ENDPOINTS.COVERAGE_AREAS_TILES}`;

        // Preserve {z}/{x}/{y} placeholders for OpenLayers VectorTileSource
        const url = query ? `${baseUrl}?${query}` : baseUrl;

        return url;
    }

    /**
     * Tuiles équipements / infrastructures (base-settings).
     * Clustering géré côté backend sur ces tuiles — pas de re-cluster front.
     * Choix multiple : `tag=ADMINISTRATION,EDUCATION` (virgules).
     * @param typeEquipment
     */
    getInfrastructureTilesUrl(typeEquipment: string | string[]): string {
        const types = (
            Array.isArray(typeEquipment) ? typeEquipment : [typeEquipment]
        )
            .map((value) => value?.trim())
            .filter((value): value is string => !!value);

        if (!types.length) {
            return '';
        }

        const baseUrl = `${this.settingsBaseUrl}${INTERACTIVE_MAP_ENDPOINTS.INFRASTRUCTURES_TILES}`;
        const query = new URLSearchParams({
            tag: types.join(','),
        }).toString();
        return `${baseUrl}?${query}`;
    }

    /**
     * Tuiles équipements/infrastructures scopées à un signalement précis
     * (management-map). Endpoint `reports`, pas `base-settings` : la liste
     * d'équipements renvoyée est propre au signalement `reportUniqId`.
     * Choix multiple : `tag=ADMINISTRATION,EDUCATION` (virgules).
     * @param reportUniqId
     * @param typeEquipment
     */
    getReportInfrastructureTilesUrl(
        reportUniqId: string,
        typeEquipment: string | string[]
    ): string {
        const types = (
            Array.isArray(typeEquipment) ? typeEquipment : [typeEquipment]
        )
            .map((value) => value?.trim())
            .filter((value): value is string => !!value);

        if (!types.length || !reportUniqId) {
            return '';
        }

        const path =
            INTERACTIVE_MAP_ENDPOINTS.REPORT_INFRASTRUCTURE_TILES.replace(
                '{reportUniqId}',
                reportUniqId
            );
        const baseUrl = `${this.baseUrl}${path}`;
        const query = new URLSearchParams({
            tag: types.join(','),
        }).toString();

        return `${baseUrl}?${query}`;
    }

    updateStatus(
        reportId: string | number,
        status: ReportStatus
    ): Observable<InteractiveMapReport> {
        const url = `${this.baseUrl}${INTERACTIVE_MAP_ENDPOINTS.REPORTS}/${reportId}`;
        return this.http.patch<InteractiveMapReport>(url, { status });
    }

    private buildQueryParams(
        bounds: Bounds,
        filters: ReportFilters,
        page: number,
        perPage: number
    ): Record<string, string> {
        const params: Record<string, string> = {
            page: String(page),
            per_page: String(perPage),
            minLat: this.formatCoordinate(bounds.minLat),
            maxLat: this.formatCoordinate(bounds.maxLat),
            minLng: this.formatCoordinate(bounds.minLng),
            maxLng: this.formatCoordinate(bounds.maxLng),
        };

        if (filters.reportTypes.length) {
            params['report_type'] = filters.reportTypes.join(',');
        }
        if (filters.operators.length) {
            params['operators'] = filters.operators.join(',');
        }
        if (filters.statuses.length) {
            params['status'] = filters.statuses.join(',');
        }
        if (filters.region) {
            params['region_id'] = filters.region;
        }
        if (filters.department) {
            params['department_id'] = filters.department;
        }
        if (filters.municipality) {
            params['municipality_id'] = filters.municipality;
        }
        if (filters.startDate) {
            params['start_date'] = filters.startDate;
        }
        if (filters.endDate) {
            params['end_date'] = filters.endDate;
        }

        return params;
    }

    private buildCoverageAreaParams(
        bounds: Bounds,
        filters: CoverageAreaFilters
    ): Record<string, string> {
        const params: Record<string, string> = {
            min_lat: this.formatCoordinate(bounds.minLat),
            max_lat: this.formatCoordinate(bounds.maxLat),
            min_lng: this.formatCoordinate(bounds.minLng),
            max_lng: this.formatCoordinate(bounds.maxLng),
        };

        if (filters.operator) {
            params['operator'] = filters.operator;
        }
        if (filters.network_technology) {
            params['network_technology'] = filters.network_technology;
        }
        if (filters.region) {
            params['region'] = filters.region;
        }
        if (filters.equipment) {
            params['equipment'] = filters.equipment;
        }

        return params;
    }

    private buildCoverageAreaTileParams(
        filters: CoverageAreaFilters
    ): Record<string, string> {
        const params: Record<string, string> = {};

        if (filters.operator) {
            params['operator'] = filters.operator;
        }
        if (filters.network_technology) {
            params['network_technology'] = filters.network_technology;
        }
        if (filters.region) {
            params['region'] = filters.region;
        }
        if (filters.equipment) {
            params['equipment'] = filters.equipment;
        }

        return params;
    }

    private formatCoordinate(value: number): string {
        return value.toFixed(7);
    }

    // private applyClientFilters(
    //     reports: InteractiveMapReport[],
    //     filters: ReportFilters
    // ): InteractiveMapReport[] {
    //     return reports.filter((report) => {
    //         const operators = this.normalizeOperators(report.operators);
    //         const municipality = this.getPlaceName(report.municipality);
    //         const reportedAt = report.reported_at
    //             ? new Date(report.reported_at)
    //             : null;

    //         return (
    //             this.matchesArray(filters.reportTypes, report.report_type) &&
    //             this.matchesOperatorFilter(filters.operators, operators) &&
    //             this.matchesArray(filters.statuses, report.state) &&
    //             (!filters.municipality ||
    //                 municipality === filters.municipality) &&
    //             (!filters.startDate ||
    //                 (!!reportedAt &&
    //                     reportedAt >= new Date(filters.startDate))) &&
    //             (!filters.endDate ||
    //                 (!!reportedAt &&
    //                     reportedAt <=
    //                         new Date(`${filters.endDate}T23:59:59`))) &&
    //             (!filters.compareOperator ||
    //                 operators.includes(filters.compareOperator))
    //         );
    //     });
    // }

    private matchesArray<T extends ReportStatus | ReportType>(
        selected: T[],
        value: T
    ): boolean {
        return selected.length === 0 || selected.includes(value);
    }

    private matchesOperatorFilter(
        selected: string[],
        operators: ReportOperator[]
    ): boolean {
        return (
            selected.length === 0 ||
            selected.some((operator) =>
                operators.includes(operator as ReportOperator)
            )
        );
    }

    private normalizeOperators(
        value: InteractiveMapReport['operators']
    ): ReportOperator[] {
        if (Array.isArray(value)) {
            return value;
        }

        try {
            return JSON.parse(value) as ReportOperator[];
        } catch {
            return value
                .split(',')
                .map((item) => item.trim())
                .filter(Boolean) as ReportOperator[];
        }
    }

    private getPlaceName(place: InteractiveMapReport['municipality']): string {
        if (!place) {
            return '';
        }
        return typeof place === 'string' ? place : place.name || '';
    }
}
