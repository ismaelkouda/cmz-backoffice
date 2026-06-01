import {
    Bounds,
    InteractiveMapReport,
    LatLng,
    MapViewState,
    ReportFilters,
} from '../models/interactive-map-report.model';

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
