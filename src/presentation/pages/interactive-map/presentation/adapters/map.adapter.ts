import { Injectable, NgZone } from '@angular/core';
import {
    Bounds,
    ClusterSummary,
    InteractiveMapReport,
    MapViewState,
    ReportOperator,
    ReportType,
} from '@pages/interactive-map/domain/models/interactive-map-report.model';
import { defaults as defaultControls } from 'ol/control';
import Feature from 'ol/Feature';
import { FeatureLike } from 'ol/Feature';
import Point from 'ol/geom/Point';
import HeatmapLayer from 'ol/layer/Heatmap';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import Map from 'ol/Map';
import { fromLonLat, toLonLat, transformExtent } from 'ol/proj';
import Cluster from 'ol/source/Cluster';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from 'ol/style';
import View from 'ol/View';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

export interface MapOptions {
    zoom?: number;
    center?: { lat: number; lng: number };
    minZoom?: number;
    maxZoom?: number;
}

export interface ClusterTooltip {
    x: number;
    y: number;
    summary?: ClusterSummary;
    report?: InteractiveMapReport;
    kind: 'cluster' | 'report';
}

const IVORY_COAST_BOUNDS: Bounds = {
    minLat: 4.25,
    maxLat: 10.75,
    minLng: -8.65,
    maxLng: -2.45,
};

@Injectable({
    providedIn: 'root',
})
export class MapAdapter {
    private map: Map | null = null;
    private lastBounds: Bounds | null = null;
    private selectedReportId: string | number | null = null;
    private suppressMoveEndUntil = 0;
    private readonly featureSource = new VectorSource();
    private readonly clusterSource = new Cluster({
        distance: 42,
        minDistance: 18,
        source: this.featureSource,
    });
    private readonly clusterLayer = new VectorLayer({
        source: this.clusterSource,
        style: (feature): Style | Style[] => this.clusterStyleFunction(feature),
    });
    private readonly heatmapSource = new VectorSource();
    private readonly heatmapLayer = new HeatmapLayer({
        source: this.heatmapSource,
        blur: 18,
        radius: 14,
        weight: (feature): number => feature.get('weight') || 0.5,
        visible: false,
    });

    private readonly moveEndSubject = new Subject<Bounds>();
    private readonly reportClickSubject = new Subject<InteractiveMapReport>();
    private readonly clusterTooltipSubject =
        new Subject<ClusterTooltip | null>();

    private readonly defaultOptions: Required<MapOptions> = {
        zoom: 7,
        center: { lat: 7.54, lng: -5.35 },
        minZoom: 5,
        maxZoom: 18,
    };

    constructor(private readonly ngZone: NgZone) {}

    init(container: HTMLElement, options?: MapOptions): void {
        if (this.map) {
            return;
        }

        const mergedOptions = { ...this.defaultOptions, ...options };

        this.map = new Map({
            target: container,
            controls: defaultControls({ zoom: false }),
            layers: [
                new TileLayer({
                    source: new OSM({
                        attributions: [
                            '© <a href="https://www.imako.digital" target="_blank">IMAKO</a>',
                        ],
                    }),
                }),
                this.heatmapLayer,
                this.clusterLayer,
            ],
            view: new View({
                center: fromLonLat([
                    mergedOptions.center.lng,
                    mergedOptions.center.lat,
                ]),
                zoom: mergedOptions.zoom,
                minZoom: mergedOptions.minZoom,
                maxZoom: mergedOptions.maxZoom,
                extent: transformExtent(
                    [
                        IVORY_COAST_BOUNDS.minLng,
                        IVORY_COAST_BOUNDS.minLat,
                        IVORY_COAST_BOUNDS.maxLng,
                        IVORY_COAST_BOUNDS.maxLat,
                    ],
                    'EPSG:4326',
                    'EPSG:3857'
                ),
            }),
        });

        this.setupMoveEndListener();
        this.setupClickListener();
        this.setupPointerMoveListener();
    }

    onMoveEnd(): Observable<Bounds> {
        return this.moveEndSubject
            .asObservable()
            .pipe(
                distinctUntilChanged((prev, curr) =>
                    this.areBoundsEqual(prev, curr)
                )
            );
    }

    onReportClick(): Observable<InteractiveMapReport> {
        return this.reportClickSubject.asObservable();
    }

    onClusterTooltip(): Observable<ClusterTooltip | null> {
        return this.clusterTooltipSubject.asObservable();
    }

    renderReports(
        reports: InteractiveMapReport[],
        heatmapEnabled: boolean
    ): void {
        this.featureSource.clear();
        this.heatmapSource.clear();

        const markerFeatures: Feature<Point>[] = [];
        const heatmapFeatures: Feature<Point>[] = [];

        for (const report of reports) {
            const lat = Number(report.lat);
            const lng = Number(report.long);

            if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
                continue;
            }

            const geometry = new Point(fromLonLat([lng, lat]));
            const markerFeature = new Feature({ geometry });
            markerFeature.set('report', report);
            markerFeature.set(
                'operators',
                this.normalizeOperators(report.operators)
            );
            markerFeatures.push(markerFeature);

            const heatmapFeature = new Feature({ geometry: geometry.clone() });
            heatmapFeature.set('report', report);
            heatmapFeature.set(
                'weight',
                this.getHeatmapWeight(report.report_type)
            );
            heatmapFeatures.push(heatmapFeature);
        }

        this.featureSource.addFeatures(markerFeatures);
        this.heatmapSource.addFeatures(heatmapFeatures);
        this.setHeatmapVisible(heatmapEnabled);
    }

    setHeatmapVisible(visible: boolean): void {
        this.clusterLayer.setVisible(!visible);
        this.heatmapLayer.setVisible(visible);
    }

    setCenter(lat: number, lng: number, preserveZoom = true): void {
        if (!this.map) {
            return;
        }

        const view = this.map.getView();
        view.setCenter(fromLonLat([lng, lat]));

        if (!preserveZoom) {
            view.setZoom(this.defaultOptions.zoom);
        }
    }

    setViewState(viewState: MapViewState): void {
        if (!this.map) {
            return;
        }

        const view = this.map.getView();
        view.setCenter(
            fromLonLat([viewState.center.lng, viewState.center.lat])
        );
        view.setZoom(viewState.zoom);
    }

    getViewState(): MapViewState | null {
        if (!this.map) {
            return null;
        }

        const view = this.map.getView();
        const center = view.getCenter();
        const zoom = view.getZoom() || this.defaultOptions.zoom;

        if (!center) {
            return null;
        }

        const [lng, lat] = toLonLat(center);
        return { center: { lat, lng }, zoom };
    }

    getBounds(): Bounds | null {
        if (!this.map) {
            return null;
        }

        const view = this.map.getView();
        const size = this.map.getSize();
        if (!size) {
            return null;
        }

        const extent = view.calculateExtent(size);
        const geographicExtent = transformExtent(
            extent,
            'EPSG:3857',
            'EPSG:4326'
        );

        return {
            minLng: geographicExtent[0],
            minLat: geographicExtent[1],
            maxLng: geographicExtent[2],
            maxLat: geographicExtent[3],
        };
    }

    getConstrainedBounds(): Bounds | null {
        const bounds = this.getBounds();

        if (!bounds || !this.intersectsBounds(bounds, IVORY_COAST_BOUNDS)) {
            return null;
        }

        return {
            minLat: Math.max(bounds.minLat, IVORY_COAST_BOUNDS.minLat),
            maxLat: Math.min(bounds.maxLat, IVORY_COAST_BOUNDS.maxLat),
            minLng: Math.max(bounds.minLng, IVORY_COAST_BOUNDS.minLng),
            maxLng: Math.min(bounds.maxLng, IVORY_COAST_BOUNDS.maxLng),
        };
    }

    focusReport(report: InteractiveMapReport): void {
        if (!this.map) {
            return;
        }

        const lat = Number(report.lat);
        const lng = Number(report.long);

        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
            return;
        }

        this.setSelectedReport(report);
        this.map.getView().animate({
            center: fromLonLat([lng, lat]),
            zoom: Math.max(this.map.getView().getZoom() || 0, 14),
            duration: 500,
        });

        this.reportClickSubject.next(report);
    }

    focusLocation(lat: number, lng: number, zoom = 14): void {
        if (!this.map || !Number.isFinite(lat) || !Number.isFinite(lng)) {
            return;
        }

        this.map.getView().animate({
            center: fromLonLat([lng, lat]),
            zoom,
            duration: 550,
        });
    }

    setSelectedReport(report: InteractiveMapReport | null): void {
        this.selectedReportId = report?.id ?? null;
        this.clusterLayer.changed();
    }

    isReady(): boolean {
        return this.map !== null;
    }

    updateSize(silent = false): void {
        if (silent) {
            this.suppressMoveEndUntil = Date.now() + 900;
        }
        this.map?.updateSize();

        if (silent) {
            setTimeout(() => {
                const bounds = this.getConstrainedBounds();
                if (bounds) {
                    this.lastBounds = bounds;
                }
            });
        }
    }

    destroy(): void {
        if (this.map) {
            this.map.setTarget(undefined);
            this.map.dispose();
            this.map = null;
        }
        this.moveEndSubject.complete();
        this.reportClickSubject.complete();
        this.clusterTooltipSubject.complete();
    }

    private setupMoveEndListener(): void {
        if (!this.map) {
            return;
        }

        this.map.on('moveend', () => {
            this.ngZone.run(() => {
                if (Date.now() < this.suppressMoveEndUntil) {
                    return;
                }

                const bounds = this.getConstrainedBounds();
                if (bounds && !this.areBoundsEqual(this.lastBounds, bounds)) {
                    this.lastBounds = bounds;
                    this.moveEndSubject.next(bounds);
                }
            });
        });
    }

    private setupClickListener(): void {
        if (!this.map) {
            return;
        }

        this.map.on('singleclick', (event) => {
            const feature = this.map?.forEachFeatureAtPixel(
                event.pixel,
                (item) => item
            );
            const reports = this.getReportsFromFeature(feature);

            if (!reports.length) {
                return;
            }

            this.ngZone.run(() => {
                this.setSelectedReport(reports[0]);
                this.reportClickSubject.next(reports[0]);
            });
        });
    }

    private setupPointerMoveListener(): void {
        if (!this.map) {
            return;
        }

        const map = this.map;

        map.on('pointermove', (event) => {
            const feature = map.forEachFeatureAtPixel(
                event.pixel,
                (item) => item
            );
            const reports = this.getReportsFromFeature(feature);

            map.getTargetElement().style.cursor = reports.length
                ? 'pointer'
                : '';

            this.ngZone.run(() => {
                if (reports.length > 1) {
                    this.clusterTooltipSubject.next({
                        x: event.pixel[0],
                        y: event.pixel[1],
                        kind: 'cluster',
                        summary: this.buildClusterSummary(reports),
                    });
                    return;
                }

                if (reports.length === 1) {
                    this.clusterTooltipSubject.next({
                        x: event.pixel[0],
                        y: event.pixel[1],
                        kind: 'report',
                        report: reports[0],
                    });
                    return;
                }

                this.clusterTooltipSubject.next(null);
            });
        });
    }

    private clusterStyleFunction(feature: FeatureLike): Style | Style[] {
        const features = (feature.get('features') || []) as Feature<Point>[];
        const count = features.length;

        if (count > 1) {
            return this.createClusterStyle(count);
        }

        const report = features[0]?.get('report') as
            | InteractiveMapReport
            | undefined;
        return this.createReportStyle(report);
    }

    private createClusterStyle(count: number): Style {
        const radius = Math.min(18 + Math.floor(count / 8), 34);

        return new Style({
            image: new CircleStyle({
                radius,
                fill: new Fill({ color: '#2563eb' }),
                stroke: new Stroke({ color: '#ffffff', width: 3 }),
            }),
            text: new Text({
                text: String(count),
                fill: new Fill({ color: '#ffffff' }),
                font: '700 13px Lato, Arial, sans-serif',
            }),
        });
    }

    private createReportStyle(report?: InteractiveMapReport): Style | Style[] {
        const color = report ? this.getMarkerColor(report) : '#64748b';
        const icon = report ? this.getReportIcon(report.report_type) : '!';
        const isSelected = this.isSelectedReport(report);

        return [
            ...(isSelected
                ? [
                      new Style({
                          image: new CircleStyle({
                              radius: 22,
                              fill: new Fill({ color: 'rgba(255,255,255,0)' }),
                              stroke: new Stroke({
                                  color: 'rgba(15, 23, 42, 0.78)',
                                  width: 4,
                              }),
                          }),
                      }),
                      new Style({
                          image: new CircleStyle({
                              radius: 18,
                              fill: new Fill({ color: 'rgba(255,255,255,0)' }),
                              stroke: new Stroke({
                                  color: '#ffffff',
                                  width: 5,
                              }),
                          }),
                      }),
                  ]
                : []),
            new Style({
                image: new CircleStyle({
                    radius: isSelected ? 16 : 15,
                    fill: new Fill({ color }),
                    stroke: new Stroke({ color: '#ffffff', width: 3 }),
                }),
                text: new Text({
                    text: icon,
                    fill: new Fill({ color: '#ffffff' }),
                    font: '700 13px Arial, sans-serif',
                    offsetY: 1,
                }),
            }),
        ];
    }

    private isSelectedReport(report?: InteractiveMapReport): boolean {
        return (
            !!report &&
            this.selectedReportId !== null &&
            String(report.id) === String(this.selectedReportId)
        );
    }

    private getReportsFromFeature(
        feature: FeatureLike | undefined
    ): InteractiveMapReport[] {
        if (!feature) {
            return [];
        }

        const clusterFeatures = feature.get('features') as
            | Feature<Point>[]
            | undefined;

        if (clusterFeatures) {
            return clusterFeatures
                .map((item) => item.get('report') as InteractiveMapReport)
                .filter(Boolean);
        }

        const report = feature.get('report') as
            | InteractiveMapReport
            | undefined;
        return report ? [report] : [];
    }

    private buildClusterSummary(
        reports: InteractiveMapReport[]
    ): ClusterSummary {
        const byOperator = { orange: 0, moov: 0, mtn: 0 };
        const byType = { zob: 0, cpo: 0, cps: 0, abi: 0 };

        for (const report of reports) {
            byType[report.report_type] += 1;
            for (const operator of this.normalizeOperators(report.operators)) {
                byOperator[operator] += 1;
            }
        }

        return {
            total: reports.length,
            byOperator,
            byType,
        };
    }

    private getMarkerColor(report: InteractiveMapReport): string {
        if (report.report_type === 'zob') {
            return '#dc2626';
        }

        const [operator] = this.normalizeOperators(report.operators);
        const operatorColors: Record<ReportOperator, string> = {
            orange: '#2563eb',
            moov: '#f97316',
            mtn: '#eab308',
        };

        if (report.status === 'rejected' || report.status === 'abandoned') {
            return '#64748b';
        }

        return operator ? operatorColors[operator] : '#0f766e';
    }

    private getReportIcon(type: ReportType): string {
        const icons: Record<ReportType, string> = {
            zob: 'X',
            cpo: '!',
            cps: '~',
            abi: '@',
        };

        return icons[type];
    }

    private getHeatmapWeight(type: ReportType): number {
        const weights: Record<ReportType, number> = {
            zob: 1,
            abi: 0.8,
            cpo: 0.7,
            cps: 0.5,
        };

        return weights[type];
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

    private areBoundsEqual(
        bounds1: Bounds | null,
        bounds2: Bounds | null
    ): boolean {
        if (!bounds1 || !bounds2) {
            return false;
        }

        const latSpan1 = Math.abs(bounds1.maxLat - bounds1.minLat);
        const latSpan2 = Math.abs(bounds2.maxLat - bounds2.minLat);
        const lngSpan1 = Math.abs(bounds1.maxLng - bounds1.minLng);
        const lngSpan2 = Math.abs(bounds2.maxLng - bounds2.minLng);
        const latSpan = Math.max(latSpan1, latSpan2);
        const lngSpan = Math.max(lngSpan1, lngSpan2);
        const latCenter1 = (bounds1.minLat + bounds1.maxLat) / 2;
        const latCenter2 = (bounds2.minLat + bounds2.maxLat) / 2;
        const lngCenter1 = (bounds1.minLng + bounds1.maxLng) / 2;
        const lngCenter2 = (bounds2.minLng + bounds2.maxLng) / 2;
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

    private intersectsBounds(bounds1: Bounds, bounds2: Bounds): boolean {
        return !(
            bounds1.maxLat < bounds2.minLat ||
            bounds1.minLat > bounds2.maxLat ||
            bounds1.maxLng < bounds2.minLng ||
            bounds1.minLng > bounds2.maxLng
        );
    }
}
