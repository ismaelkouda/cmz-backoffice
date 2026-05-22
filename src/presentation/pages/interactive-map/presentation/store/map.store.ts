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
    municipality: '',
    dateFrom: '',
    dateTo: '',
    compareOperator: '',
};

export interface MapState {
    userPosition: LatLng | null;
    bounds: Bounds | null;
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
    bounds: null,
    view: {
        center: { lat: 7.54, lng: -5.35 },
        zoom: 7,
    },
    reports: [],
    filters: { ...EMPTY_REPORT_FILTERS },
    heatmapEnabled: false,
    selectedReport: null,
    loading: false,
    permission: 'prompt',
    error: null,
};

@Injectable({
    providedIn: 'root',
})
export class MapStore {
    private readonly state = signal<MapState>(initialState);

    public readonly userPosition = computed(() => this.state().userPosition);
    public readonly bounds = computed(() => this.state().bounds);
    public readonly view = computed(() => this.state().view);
    public readonly reports = computed(() => this.state().reports);
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

    public readonly hasBounds = computed(() => this.bounds() !== null);
    public readonly hasReports = computed(() => this.reports().length > 0);
    public readonly hasError = computed(() => !!this.error());

    public readonly municipalities = computed(() => {
        const names = this.reports()
            .map((report) => this.getPlaceName(report.municipality))
            .filter(Boolean);

        return [...new Set(names)].sort((a, b) => a.localeCompare(b));
    });

    public readonly visibleReports = computed(() => {
        const compareOperator = this.filters().compareOperator;

        if (!compareOperator) {
            return this.reports();
        }

        return this.reports().filter((report) =>
            this.normalizeOperators(report.operators).includes(compareOperator)
        );
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

    public denyPermission(): void {
        this.patchState({
            permission: 'denied',
            userPosition: null,
            bounds: null,
            reports: [],
            loading: false,
            error: null,
        });
    }

    public setPermission(permission: PermissionState): void {
        this.patchState({ permission });
    }

    public setUserPosition(position: LatLng): void {
        this.patchState({
            userPosition: position,
            error: null,
        });
    }

    public setBounds(bounds: Bounds): void {
        const current = this.state().bounds;

        if (this.areBoundsEqual(current, bounds)) {
            return;
        }

        this.patchState({ bounds });
    }

    public setView(view: MapViewState): void {
        this.patchState({ view });
    }

    public setReports(reports: InteractiveMapReport[]): void {
        this.patchState({
            reports: [...reports],
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
        this.patchState({
            loading: true,
            error: null,
        });
    }

    public setLoading(loading: boolean): void {
        this.patchState({ loading });
    }

    public setError(message: string | null): void {
        this.patchState({
            error: message,
            reports: [],
            loading: false,
        });
    }

    public reset(): void {
        this.state.set({ ...initialState });
    }

    private patchState(partial: Partial<MapState>): void {
        this.state.update((current) => ({
            ...current,
            ...partial,
        }));
    }

    private areBoundsEqual(b1: Bounds | null, b2: Bounds | null): boolean {
        if (!b1 || !b2) {
            return false;
        }

        const latSpan1 = Math.abs(b1.maxLat - b1.minLat);
        const latSpan2 = Math.abs(b2.maxLat - b2.minLat);
        const lngSpan1 = Math.abs(b1.maxLng - b1.minLng);
        const lngSpan2 = Math.abs(b2.maxLng - b2.minLng);
        const latSpan = Math.max(latSpan1, latSpan2);
        const lngSpan = Math.max(lngSpan1, lngSpan2);
        const latCenter1 = (b1.minLat + b1.maxLat) / 2;
        const latCenter2 = (b2.minLat + b2.maxLat) / 2;
        const lngCenter1 = (b1.minLng + b1.maxLng) / 2;
        const lngCenter2 = (b2.minLng + b2.maxLng) / 2;
        const panTolerance = 0.12;
        const zoomTolerance = 0.08;

        return (
            Math.abs(latCenter1 - latCenter2) <
                Math.max(latSpan * panTolerance, 0.0005) &&
            Math.abs(lngCenter1 - lngCenter2) <
                Math.max(lngSpan * panTolerance, 0.0005) &&
            Math.abs(latSpan1 - latSpan2) < latSpan * zoomTolerance &&
            Math.abs(lngSpan1 - lngSpan2) < lngSpan * zoomTolerance
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
