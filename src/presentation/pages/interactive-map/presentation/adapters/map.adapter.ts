import { NgZone, inject } from '@angular/core';
import {
    Bounds,
    ClusterSummary,
    CoverageAreaGeoJson,
    CoverageAreaProperties,
    InteractiveMapReport,
    MapViewState,
    ReportOperator,
    ReportType,
} from '@pages/interactive-map/domain/models/interactive-map-report.model';
import { defaults as defaultControls } from 'ol/control';
import { Coordinate } from 'ol/coordinate';
import { Extent } from 'ol/extent';
import Feature from 'ol/Feature';
import { FeatureLike } from 'ol/Feature';
import GeoJSON from 'ol/format/GeoJSON';
import Geometry from 'ol/geom/Geometry';
import Point from 'ol/geom/Point';
import HeatmapLayer from 'ol/layer/Heatmap';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import Map from 'ol/Map';
import Overlay from 'ol/Overlay';
import { fromLonLat, toLonLat, transformExtent } from 'ol/proj';
import Cluster from 'ol/source/Cluster';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from 'ol/style';
import View from 'ol/View';
import { Observable, Subject } from 'rxjs';

export interface MapOptions {
    zoom: number;
    center: { lat: number; lng: number };
    minZoom?: number;
    maxZoom?: number;
}

export interface ClusterTooltip {
    summary?: ClusterSummary;
    report?: InteractiveMapReport;
    kind: 'cluster' | 'report';
    coordinate: Coordinate;
    reports: InteractiveMapReport[];
}

export interface MapClickInfo {
    kind: 'cluster' | 'report';
    coordinate: Coordinate;
    reports: InteractiveMapReport[];
    report?: InteractiveMapReport;
    summary?: ClusterSummary;
}

const IVORY_COAST_BOUNDS: Bounds = {
    minLat: 2.5, // Étendu vers le sud
    maxLat: 12.0, // Étendu vers le nord
    minLng: -11.0, // Étendu vers l'ouest
    maxLng: 0.5, // Étendu vers l'est (inclut une petite marge)
};

export class MapAdapter {
    private readonly ngZone = inject(NgZone);

    private map: Map | null = null;
    private hoverOverlay: Overlay | null = null;
    private clickOverlay: Overlay | null = null;
    private selectedReportId: string | number | null = null;
    private suppressMoveEndUntil = 0;
    private lastBounds: Bounds | null = null;
    private readonly featureSource = new VectorSource();
    private readonly clusterSource = new Cluster({
        distance: 42,
        minDistance: 18,
        source: this.featureSource,
    });
    private readonly clusterLayer = new VectorLayer({
        source: this.clusterSource,
        style: (feature): Style | Style[] => {
            return this.clusterStyleFunction(feature);
        },
    });
    private readonly coverageAreaSource = new VectorSource();
    private readonly coverageAreaClusterSource = new Cluster({
        distance: 48,
        minDistance: 18,
        source: this.coverageAreaSource,
    });
    private readonly coverageAreaLayer = new VectorLayer({
        source: this.coverageAreaClusterSource,
        style: (feature): Style | Style[] => {
            return this.coverageAreaStyleFunction(feature);
        },
        visible: false,
    });
    private readonly heatmapSource = new VectorSource();
    private readonly heatmapLayer = new HeatmapLayer({
        source: this.heatmapSource,
        blur: 10,
        radius: 14,
        weight: (feature): number => feature.get('weight') || 0.5,
        visible: false,
    });

    private readonly moveEndSubject = new Subject<Bounds>();
    private readonly mapClickSubject = new Subject<MapClickInfo>();
    private readonly clusterTooltipSubject =
        new Subject<ClusterTooltip | null>();

    init(container: HTMLElement, options: MapOptions): void {
        if (this.map) {
            return;
        }

        const mergedOptions = { ...options };

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
                this.coverageAreaLayer,
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
        console.log('fsfsfsfsfsf');
        this.setupClickListener();
        this.setupPointerMoveListener();
    }
    onMoveEnd(): Observable<Bounds> {
        return this.moveEndSubject.asObservable();
    }

    onMapClick(): Observable<MapClickInfo> {
        return this.mapClickSubject.asObservable();
    }

    onClusterTooltip(): Observable<ClusterTooltip | null> {
        return this.clusterTooltipSubject.asObservable();
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

    renderCoverageAreas(
        geoJson: CoverageAreaGeoJson | null,
        visible: boolean
    ): void {
        this.coverageAreaSource.clear();

        if (!geoJson || !visible) {
            this.coverageAreaLayer.setVisible(false);
            return;
        }

        const format = new GeoJSON();
        const geoJsonFeatures = format.readFeatures(geoJson, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857',
        }) as Feature<Geometry>[];
        const coverageFeatures = geoJsonFeatures
            .map((feature) => this.createCoverageAreaFeature(feature))
            .filter((feature): feature is Feature<Point> => !!feature);

        this.coverageAreaSource.addFeatures(coverageFeatures);
        this.coverageAreaLayer.setVisible(true);
    }

    setCoverageAreasVisible(visible: boolean): void {
        this.coverageAreaLayer.setVisible(visible);
    }

    setHeatmapVisible(visible: boolean): void {
        this.clusterLayer.setVisible(!visible);
        this.heatmapLayer.setVisible(visible);
    }

    setCenter(lat: number, lng: number): void {
        if (!this.map) {
            return;
        }

        const view = this.map.getView();
        view.setCenter(fromLonLat([lng, lat]));
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
        const zoom = view.getZoom();

        if (!center) {
            return null;
        }

        if (!zoom) {
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

        this.showClickOverlay(fromLonLat([lng, lat]));
        this.mapClickSubject.next({
            kind: 'report',
            coordinate: fromLonLat([lng, lat]),
            reports: [report],
            report,
        });
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
        this.selectedReportId = report?.uniq_id ?? null;
        this.clusterLayer.changed();
    }

    setHoverOverlayElement(element: HTMLElement): void {
        if (!this.map) {
            return;
        }

        if (this.hoverOverlay) {
            this.hoverOverlay.setElement(element);
            return;
        }

        this.hoverOverlay = new Overlay({
            element,
            positioning: 'bottom-center',
            offset: [0, -18],
            stopEvent: true,
            insertFirst: false,
        });
        // this.map.addOverlay(this.hoverOverlay);
    }

    setClickOverlayElement(element: HTMLElement): void {
        if (!this.map) {
            return;
        }

        if (this.clickOverlay) {
            this.clickOverlay.setElement(element);
            return;
        }

        this.clickOverlay = new Overlay({
            element,
            positioning: 'top-center',
            offset: [0, 22],
            stopEvent: true,
            insertFirst: false,
            // autoPan: {
            //     animation: { duration: 220 },
            //     margin: 18,
            // },
        });
        this.map.addOverlay(this.clickOverlay);
    }

    showHoverOverlay(coordinate: Coordinate): void {
        this.hoverOverlay?.setPosition(coordinate);
    }

    hideHoverOverlay(): void {
        this.hoverOverlay?.setPosition(undefined);
    }

    showClickOverlay(coordinate: Coordinate): void {
        this.clickOverlay?.setPosition(coordinate);
    }

    hideClickOverlay(): void {
        this.clickOverlay?.setPosition(undefined);
    }

    isReady(): boolean {
        return this.map !== null;
    }

    destroy(): void {
        if (this.map) {
            this.map.setTarget(undefined);
            this.map.dispose();
            this.map = null;
        }
        this.moveEndSubject.complete();
        this.mapClickSubject.complete();
        this.clusterTooltipSubject.complete();
    }

    private setupClickListener(): void {
        console.log('click');
        if (!this.map) {
            return;
        }
        console.log('map');

        this.map.on('singleclick', (event) => {
            const feature = this.map?.forEachFeatureAtPixel(
                event.pixel,
                (item) => item,
                {
                    layerFilter: (layer) => layer === this.clusterLayer,
                }
            );
            const reports = this.getReportsFromFeature(feature);

            if (!reports.length) {
                this.hideClickOverlay();
                this.mapClickSubject.next({
                    kind: 'cluster',
                    coordinate: event.coordinate,
                    reports: [],
                    summary: this.buildClusterSummary([]),
                });
                return;
            }

            this.ngZone.run(() => {
                const kind = reports.length > 1 ? 'cluster' : 'report';

                if (kind === 'report') {
                    this.setSelectedReport(reports[0]);
                } else {
                    this.setSelectedReport(null);
                }

                this.mapClickSubject.next({
                    kind,
                    coordinate: event.coordinate,
                    reports,
                    report: kind === 'report' ? reports[0] : undefined,
                    summary:
                        kind === 'cluster'
                            ? this.buildClusterSummary(reports)
                            : undefined,
                });
                this.showClickOverlay(event.coordinate);
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
                (item) => item,
                {
                    layerFilter: (layer) => layer === this.clusterLayer,
                }
            );
            const reports = this.getReportsFromFeature(feature);

            map.getTargetElement().style.cursor = reports.length
                ? 'pointer'
                : '';

            this.ngZone.run(() => {
                if (reports.length > 1) {
                    this.clusterTooltipSubject.next({
                        kind: 'cluster',
                        coordinate: event.coordinate,
                        reports,
                        summary: this.buildClusterSummary(reports),
                    });
                    this.showHoverOverlay(event.coordinate);
                    return;
                }

                if (reports.length === 1) {
                    this.clusterTooltipSubject.next({
                        kind: 'report',
                        coordinate: event.coordinate,
                        reports,
                        report: reports[0],
                    });
                    this.showHoverOverlay(event.coordinate);
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

    private coverageAreaStyleFunction(feature: FeatureLike): Style | Style[] {
        const features = (feature.get('features') || []) as Feature<Point>[];
        const count = features.length;

        if (count > 1) {
            return this.createCoverageAreaClusterStyle(features);
        }

        const coverageArea = features[0]?.get('coverageArea') as
            | CoverageAreaProperties
            | undefined;
        return this.createCoverageAreaStyle(coverageArea);
    }

    private createClusterStyle(count: number): Style {
        const radius = Math.min(18 + Math.floor(count / 8), 34);

        return new Style({
            image: new CircleStyle({
                radius,
                fill: new Fill({ color: '#000000' }),
                stroke: new Stroke({ color: '#ffffff', width: 3 }),
            }),
            text: new Text({
                text: String(count),
                fill: new Fill({ color: '#ffffff' }),
                font: '700 13px Lato, Arial, sans-serif',
            }),
        });
    }

    private createCoverageAreaClusterStyle(
        features: Feature<Point>[]
    ): Style {
        const operators = features
            .map((feature) => {
                const coverageArea = feature.get(
                    'coverageArea'
                ) as CoverageAreaProperties;
                return this.normalizeOperatorName(coverageArea?.operator);
            })
            .filter(Boolean);
        const uniqueOperators = [...new Set(operators)];
        const color =
            uniqueOperators.length === 1
                ? this.getCoverageAreaColor(uniqueOperators[0])
                : '#111827';
        const radius = Math.min(16 + Math.floor(features.length / 10), 32);

        return new Style({
            image: new CircleStyle({
                radius,
                fill: new Fill({ color }),
                stroke: new Stroke({ color: '#ffffff', width: 3 }),
            }),
            text: new Text({
                text: String(features.length),
                fill: new Fill({ color: '#ffffff' }),
                font: '700 13px Lato, Arial, sans-serif',
            }),
        });
    }

    private createCoverageAreaStyle(
        coverageArea?: CoverageAreaProperties
    ): Style {
        const color = this.getCoverageAreaColor(
            this.normalizeOperatorName(coverageArea?.operator)
        );

        return new Style({
            image: new CircleStyle({
                radius: 13,
                fill: new Fill({ color: this.hexToRgba(color, 0.78) }),
                stroke: new Stroke({ color, width: 4 }),
            }),
        });
    }

    private createReportStyle(report?: InteractiveMapReport): Style | Style[] {
        console.log('report bgrbgrbgrbr createReportStyle: ', report);
        const color = report ? this.getMarkerColor(report) : '#64748b';
        // const icon = report ? this.getReportIcon(report.report_type) : '!';
        // const isSelected = this.isSelectedReport(report);

        return [
            // ...(isSelected
            //     ? [
            //           new Style({
            //               image: new CircleStyle({
            //                   radius: 22,
            //                   fill: new Fill({ color: 'rgba(255,255,255,0)' }),
            //                   stroke: new Stroke({
            //                       color: 'rgba(15, 23, 42, 0.78)',
            //                       width: 4,
            //                   }),
            //               }),
            //           }),
            //           new Style({
            //               image: new CircleStyle({
            //                   radius: 18,
            //                   fill: new Fill({ color: 'rgba(255,255,255,0)' }),
            //                   stroke: new Stroke({
            //                       color: '#ffffff',
            //                       width: 5,
            //                   }),
            //               }),
            //           }),
            //       ]
            //     : []),
            new Style({
                image: new CircleStyle({
                    radius: 15,
                    fill: new Fill({ color }),
                    stroke: new Stroke({ color: '#ffffff', width: 3 }),
                }),
                text: new Text({
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
            String(report.uniq_id) === String(this.selectedReportId)
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
        const colors: Record<ReportType, string> = {
            zob: '#7c3aed',
            cpo: '#0f766e',
            cps: '#be123c',
            abi: '#475569',
        };

        return colors[report.report_type];

        // const [operator] = this.normalizeOperators(report.operators);
        // const operatorColors: Record<ReportOperator, string> = {
        //     orange: '#2563eb',
        //     moov: '#f97316',
        //     mtn: '#eab308',
        // };

        // if (report.state === 'rejected' || report.state === 'abandoned') {
        //     return '#64748b';
        // }

        // return operator ? operatorColors[operator] : '#0f766e';
    }

    // private getReportIcon(type: ReportType): string {
    //     console.log('type: ', type);
    //     const icons: Record<ReportType, string> = {
    //         zob: 'X',
    //         cpo: '!',
    //         cps: '~',
    //         abi: '@',
    //     };

    //     return icons[type];
    // }

    private getHeatmapWeight(type: ReportType): number {
        console.log('type: ', type);
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

    private createCoverageAreaFeature(
        feature: Feature<Geometry>
    ): Feature<Point> | null {
        const geometry = feature.getGeometry();
        if (!geometry) {
            return null;
        }

        const coordinate =
            geometry instanceof Point
                ? geometry.getCoordinates()
                : geometry.getClosestPoint(
                      this.getExtentCenter(geometry.getExtent())
                  );
        const coverageFeature = new Feature({
            geometry: new Point(coordinate),
        });
        const coverageArea = {
            ...feature.getProperties(),
        } as CoverageAreaProperties;
        delete (coverageArea as { geometry?: unknown }).geometry;
        coverageFeature.set('coverageArea', coverageArea);

        return coverageFeature;
    }

    private getCoverageAreaColor(operator?: string): string {
        const colors: Record<ReportOperator, string> = {
            orange: '#ff7900',
            mtn: '#ffcc00',
            moov: '#005baa',
        };

        return operator && operator in colors
            ? colors[operator as ReportOperator]
            : '#6b7280';
    }

    private normalizeOperatorName(value: unknown): ReportOperator | undefined {
        if (typeof value !== 'string') {
            return undefined;
        }

        const normalized = value.trim().toLowerCase();
        if (
            normalized === 'orange' ||
            normalized === 'mtn' ||
            normalized === 'moov'
        ) {
            return normalized;
        }

        return undefined;
    }

    private hexToRgba(hex: string, alpha: number): string {
        const value = hex.replace('#', '');
        const red = parseInt(value.slice(0, 2), 16);
        const green = parseInt(value.slice(2, 4), 16);
        const blue = parseInt(value.slice(4, 6), 16);

        return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
    }

    private getExtentCenter(extent: Extent): Coordinate {
        return [(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2];
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
