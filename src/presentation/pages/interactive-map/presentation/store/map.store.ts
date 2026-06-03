import { Injectable, computed, signal } from '@angular/core';
import {
    Bounds,
    InteractiveMapReport,
    LatLng,
    MapViewState,
    ReportFilters,
    ReportOperator,
} from '@pages/interactive-map/domain/models/interactive-map-report.model';

export type PermissionState = 'granted' | 'denied' | 'prompt';

export const EMPTY_REPORT_FILTERS: ReportFilters = {
    reportTypes: [],
    operators: [],
    statuses: [],
    region: '',
    department: '',
    municipality: '',
    startDate: '',
    endDate: '',
    compareOperator: '',
};

export interface MapState {
    userPosition: LatLng | null;
    viewportBounds: Bounds | null;
    loadedBounds: Bounds | null;
    view: MapViewState;
    reports: InteractiveMapReport[];
    filters: ReportFilters;
    heatmapEnabled: boolean;
    selectedReport: InteractiveMapReport | null;
    loading: boolean;
    permission: PermissionState;
    error: string | null;
}

const initialState: MapState = {
    userPosition: null,

    viewportBounds: null,

    loadedBounds: null,

    view: {
        center: { lat: 7.545, lng: -5.545 },
        zoom: 0,
    },

    reports: [],

    filters: { ...EMPTY_REPORT_FILTERS },

    heatmapEnabled: false,

    selectedReport: null,

    loading: false,

    permission: 'prompt',

    error: null,
};

@Injectable({ providedIn: 'root' })
export class MapStore {
    private readonly state = signal<MapState>(initialState);
    // Cache local des signalements chargés (tous, sans filtrage)
    private reportsCache = new Map<string, InteractiveMapReport>();

    // Signaux publics (inchangés)
    public readonly userPosition = computed(() => this.state().userPosition);
    public readonly viewportBounds = computed(
        () => this.state().viewportBounds
    );
    public readonly loadedBounds = computed(() => this.state().loadedBounds);
    public readonly reports = computed(() => this.state().reports);
    public readonly view = computed(() => this.state().view);
    public readonly filters = computed(() => this.state().filters);
    public readonly heatmapEnabled = computed(
        () => this.state().heatmapEnabled
    );
    public readonly selectedReport = computed(
        () => this.state().selectedReport
    );
    public readonly loading = computed(() => this.state().loading);
    public readonly permission = computed(() => this.state().permission);
    public readonly error = computed(() => this.state().error);

    public readonly hasBounds = computed(() => this.viewportBounds() !== null);
    public readonly hasReports = computed(() => this.reportsCache.size > 0);
    public readonly hasError = computed(() => !!this.error());

    public readonly visibleReports = computed(() => {
        const all = this.reports();
        console.log('all reports count:', all.length);
        const filtered = all.filter((r) =>
            this.matchesFilters(r, this.filters())
        );
        console.log('filtered count:', filtered.length);
        return filtered;
    });

    public readonly municipalities = computed(() => {
        const names = this.reports()
            .map((report) => this.getPlaceName(report.municipality))
            .filter(Boolean);
        return [...new Set(names)].sort((a, b) => a.localeCompare(b));
    });

    public readonly isPermissionGranted = computed(
        () => this.permission() === 'granted'
    );
    public readonly isPermissionDenied = computed(
        () => this.permission() === 'denied'
    );
    public readonly isPermissionPrompt = computed(
        () => this.permission() === 'prompt'
    );

    public setViewportBounds(bounds: Bounds): void {
        this.patchState({
            viewportBounds: bounds,
        });
    }

    public setLoadedBounds(bounds: Bounds): void {
        this.patchState({
            loadedBounds: bounds,
        });
    }
    public setPermission(permission: PermissionState): void {
        console.log('permission: ', permission);
        this.patchState({ permission });
    }

    public setUserPosition(position: LatLng): void {
        console.log('position: ', position);
        this.patchState({
            userPosition: position,
            error: null,
        });
    }

    public expandBounds(bounds: Bounds, factor = 2): Bounds {
        const latSpan = bounds.maxLat - bounds.minLat;
        const lngSpan = bounds.maxLng - bounds.minLng;
        const extraLat = (latSpan * factor - latSpan) / 2;
        const extraLng = (lngSpan * factor - lngSpan) / 2;
        return {
            minLat: bounds.minLat - extraLat,
            maxLat: bounds.maxLat + extraLat,
            minLng: bounds.minLng - extraLng,
            maxLng: bounds.maxLng + extraLng,
        };
    }

    public isInsideLoadedArea(viewport: Bounds, loaded: Bounds): boolean {
        return (
            viewport.minLat >= loaded.minLat &&
            viewport.maxLat <= loaded.maxLat &&
            viewport.minLng >= loaded.minLng &&
            viewport.maxLng <= loaded.maxLng
        );
    }

    public needsLoading(): boolean {
        const viewport = this.viewportBounds();
        const loaded = this.loadedBounds();
        if (!viewport) {
            return false;
        }
        if (!loaded) {
            return true;
        }
        return !this.isInsideLoadedArea(viewport, loaded);
    }

    public mergeLoadedReports(
        newReports: InteractiveMapReport[],
        newBounds: Bounds
    ): void {
        for (const report of newReports) {
            const reportWithId = { ...report, id: report.uniq_id };
            this.reportsCache.set(String(reportWithId.uniq_id), reportWithId);
        }

        const currentLoaded = this.loadedBounds();
        const updatedLoadedBounds = !currentLoaded
            ? { ...newBounds }
            : {
                  minLat: Math.min(currentLoaded.minLat, newBounds.minLat),
                  maxLat: Math.max(currentLoaded.maxLat, newBounds.maxLat),
                  minLng: Math.min(currentLoaded.minLng, newBounds.minLng),
                  maxLng: Math.max(currentLoaded.maxLng, newBounds.maxLng),
              };

        // Un seul patchState pour tout
        this.patchState({
            loadedBounds: updatedLoadedBounds,
            reports: Array.from(this.reportsCache.values()),
            loading: false,
            error: null,
        });
    }

    public setReports(reports: InteractiveMapReport[]): void {
        this.reportsCache.clear();
        for (const report of reports) {
            this.reportsCache.set(String(report.uniq_id), report);
        }
        this.patchState({
            reports: Array.from(this.reportsCache.values()),
            loading: false,
            error: null,
        });
    }

    public updateFilters(filters: Partial<ReportFilters>): void {
        this.patchState({
            filters: {
                ...this.state().filters,
                ...filters,
            },
        });
    }

    public clearLoadedReports(): void {
        this.reportsCache.clear();
        this.patchState({
            loadedBounds: null,
            reports: [],
            loading: false,
            error: null,
        });
    }

    public resetFilters(): void {
        this.patchState({ filters: { ...EMPTY_REPORT_FILTERS } });
    }

    public setHeatmapEnabled(heatmapEnabled: boolean): void {
        this.patchState({ heatmapEnabled });
    }

    public setSelectedReport(report: InteractiveMapReport | null): void {
        this.patchState({ selectedReport: report });
    }

    public startLoading(): void {
        this.patchState({ loading: true, error: null });
    }

    public setLoading(loading: boolean): void {
        this.patchState({ loading });
    }

    public setError(message: string | null): void {
        this.patchState({
            error: message,
            loading: false,
        });
    }

    public reset(): void {
        this.reportsCache.clear();
        this.state.set({ ...initialState });
    }

    private patchState(partial: Partial<MapState>): void {
        this.state.update((current) => ({ ...current, ...partial }));
    }

    private matchesFilters(
        report: InteractiveMapReport,
        filters: ReportFilters
    ): boolean | null {
        const operators = this.normalizeOperators(report.operators);
        const reportedAt = report.reported_at
            ? new Date(report.reported_at)
            : null;

        return (
            this.matchesArray(filters.reportTypes, report.report_type) &&
            this.matchesOperatorFilter(filters.operators, operators) &&
            this.matchesArray(filters.statuses, report.state) &&
            (!filters.startDate ||
                (reportedAt && reportedAt >= new Date(filters.startDate))) &&
            (!filters.endDate ||
                (reportedAt &&
                    reportedAt <= new Date(`${filters.endDate}T23:59:59`))) &&
            (!filters.compareOperator ||
                operators.includes(filters.compareOperator))
        );
    }

    private matchesArray<T>(selected: T[], value: T): boolean {
        return selected.length === 0 || selected.includes(value);
    }

    private matchesOperatorFilter(
        selected: string[],
        operators: ReportOperator[]
    ): boolean {
        return (
            selected.length === 0 ||
            selected.some((op) => operators.includes(op as ReportOperator))
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

    public setView(view: MapViewState): void {
        console.log('view: ', view);
        this.patchState({ view });
    }
}
