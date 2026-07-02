import { NgZone, inject } from '@angular/core';
import { ConfigurationService } from '@core/services/configuration.service';
import {
    Bounds,
    ClusterSummary,
    CoverageAreaProperties,
    InteractiveMapReport,
    MapViewState,
    ReportOperator,
    ReportType,
} from '@pages/interactive-map/domain/models/interactive-map-report.model';
import { AuthToken } from '@shared/domain/interfaces/current-user.interface';
import { EncodingDataService } from '@shared/domain/services/encoding-data.service';
import { defaults as defaultControls } from 'ol/control';
import { Coordinate } from 'ol/coordinate';
import Feature from 'ol/Feature';
import { FeatureLike } from 'ol/Feature';
import MVT from 'ol/format/MVT';
import Point from 'ol/geom/Point';
import HeatmapLayer from 'ol/layer/Heatmap';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorTileLayer from 'ol/layer/VectorTile';
import Map from 'ol/Map';
import Overlay from 'ol/Overlay';
import { fromLonLat, toLonLat, transformExtent } from 'ol/proj';
import Cluster from 'ol/source/Cluster';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import VectorTileSource from 'ol/source/VectorTile';
import {
    Circle as CircleStyle,
    Fill,
    Icon,
    Stroke,
    Style,
    Text,
} from 'ol/style';
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
    private static readonly CLUSTER_MIN_RADIUS = 18;
    private static readonly CLUSTER_MAX_RADIUS = 34;

    private static readonly MARKER_MIN_RADIUS = 7;
    private static readonly MARKER_MAX_RADIUS = 11;

    private static readonly COVERAGE_MARKER_MIN_RADIUS = 6;
    private static readonly COVERAGE_MARKER_MAX_RADIUS = 14;

    private static readonly CLUSTER_DISTANCE = 42;
    private static readonly CLUSTER_MIN_DISTANCE = 18;

    private readonly ngZone = inject(NgZone);
    private readonly encodingService = inject(EncodingDataService);
    private readonly configurationService = inject(ConfigurationService);

    private map: Map | null = null;
    private hoverOverlay: Overlay | null = null;
    private clickOverlay: Overlay | null = null;
    private selectedReportId: string | number | null = null;
    private suppressMoveEndUntil = 0;
    private lastBounds: Bounds | null = null;
    private readonly featureSource = new VectorSource();
    private readonly clusterSource = new Cluster({
        distance: MapAdapter.CLUSTER_DISTANCE,
        minDistance: MapAdapter.CLUSTER_MIN_DISTANCE,
        source: this.featureSource,
    });
    private readonly clusterLayer = new VectorLayer({
        source: this.clusterSource,
        style: (feature): Style | Style[] => {
            return this.clusterStyleFunction(feature);
        },
    });
    private readonly coverageAreaLayer = new VectorTileLayer({
        declutter: true,
        renderMode: 'hybrid',
        style: (feature): Style => this.createCoverageAreaTileStyle(feature),
        visible: false,
        zIndex: 1,
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
            controls: defaultControls({ zoom: true }),
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

    renderCoverageAreaTiles(tileUrl: string | null, visible: boolean): void {
        if (!tileUrl || !visible) {
            this.coverageAreaLayer.setSource(null);
            this.coverageAreaLayer.setVisible(false);
            return;
        }

        this.coverageAreaLayer.setSource(
            new VectorTileSource({
                format: new MVT({
                    layers: ['coverage_areas'],
                    idProperty: 'id',
                }),
                maxZoom: 22,
                transition: 160,
                url: tileUrl,
                wrapX: false,
                tileLoadFunction: this.createAuthenticatedTileLoadFunction(),
            })
        );
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
        if (!this.map) {
            return;
        }

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

    private createCoverageAreaTileStyle(feature: FeatureLike): Style {
        const coverageArea = feature.getProperties() as CoverageAreaProperties;
        const color = this.getCoverageAreaColor(
            this.normalizeOperatorName(coverageArea?.operator)
        );
        const radiusInMeters = Number(coverageArea?.radius);

        // Conversion simplifiée : 1 pixel ≈ 1 mètre à certains niveaux de zoom
        // Pour une conversion plus précise, utiliser la résolution de la carte
        const markerRadius = Number.isFinite(radiusInMeters)
            ? this.metersToPixels(radiusInMeters)
            : 15; // Taille par défaut si pas de rayon

        return new Style({
            image: new CircleStyle({
                radius: markerRadius,
                fill: new Fill({ color: this.hexToRgba(color, 0.35) }), // Plus transparent
                stroke: new Stroke({
                    color: color,
                    width: 2.5,
                    lineDash: [4, 4], // Optionnel : bordure en pointillés
                }),
            }),
        });
    }

    // Nouvelle méthode pour convertir mètres en pixels
    private metersToPixels(meters: number, latitude?: number): number {
        if (!this.map) {
            return Math.min(meters / 10, 50);
        }

        const view = this.map.getView();
        const resolution = view.getResolution() || 1;
        const center = view.getCenter();
        const lat = latitude || (center ? toLonLat(center)[1] : 0);

        // Facteur de correction pour la projection Mercator
        const metersPerPixel = resolution * Math.cos((lat * Math.PI) / 180);
        const pixels = meters / metersPerPixel;

        // Limites adaptatives selon le zoom
        const zoom = view.getZoom() || 7;
        const minPixels = Math.max(5, 15 - zoom); // Plus petit quand on dézoome
        const maxPixels = Math.min(300, 50 + zoom * 15); // Plus grand quand on zoome

        return Math.min(Math.max(pixels, minPixels), maxPixels);
    }

    private getMarkerRadius(): number {
        const zoom = this.map?.getView().getZoom() ?? 10;

        const minZoom = 7;
        const maxZoom = 18;

        const t = Math.min(
            Math.max((zoom - minZoom) / (maxZoom - minZoom), 0),
            1
        );

        return (
            MapAdapter.MARKER_MIN_RADIUS +
            t * (MapAdapter.MARKER_MAX_RADIUS - MapAdapter.MARKER_MIN_RADIUS)
        );
    }

    private createReportStyle(report?: InteractiveMapReport): Style | Style[] {
        if (!report) {
            return new Style({
                image: new CircleStyle({
                    radius: this.getMarkerRadius(),
                    fill: new Fill({ color: '#64748b' }),
                }),
            });
        }

        // Utiliser une icône SVG si disponible
        const iconPath = this.getReportIcon(report.report_type);

        if (iconPath) {
            return new Style({
                image: new Icon({
                    src: iconPath,
                    scale: this.getDynamicMarkerScale(),
                    anchor: [0.5, 0.5],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'fraction',
                }),
            });
        }

        // Fallback : cercle coloré par opérateur
        const color = this.getMarkerColor(report);
        return new Style({
            image: new CircleStyle({
                radius: this.getMarkerRadius(),
                fill: new Fill({ color }),
                stroke: new Stroke({ color: '#fff', width: 2 }),
            }),
        });
    }

    private getReportIcon(type: ReportType): string | null {
        const icons: Record<ReportType, string> = {
            zob: 'assets/images/icones/report_zb.svg',
            cpo: 'assets/images/icones/report_cpo.svg',
            cps: 'assets/images/icones/report_cps.svg',
            abi: 'assets/images/icones/report_ai.svg',
        };

        return icons[type] || null;
    }

    private getDynamicMarkerScale(): number {
        if (!this.map) {
            return 0.3;
        }

        const zoom = this.map.getView().getZoom() ?? 10;

        const factor = Math.max(0, Math.min((zoom - 7) / (18 - 7), 1));

        return 0.05 + Math.pow(factor, 0.8) * 0.1;
    }

    private getDynamicMarkerRadius(): number {
        if (!this.map) {
            return 15;
        }

        const zoom = this.map.getView().getZoom() || 7;

        // Échelle logarithmique pour une transition plus douce
        // Zoom 7 → radius 8, Zoom 14 → radius 20, Zoom 18 → radius 28
        const minRadius = 8;
        const maxRadius = 32;
        const minZoom = 7;
        const maxZoom = 18;

        // Interpolation exponentielle pour un effet plus naturel
        const factor = (zoom - minZoom) / (maxZoom - minZoom);
        const clampedFactor = Math.max(0, Math.min(1, factor));

        return (
            minRadius + (maxRadius - minRadius) * Math.pow(clampedFactor, 0.7)
        );
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
        // Priorité 1 : Couleur basée sur l'opérateur
        const operators = this.normalizeOperators(report.operators);
        if (operators.length > 0) {
            const operatorColors: Record<ReportOperator, string> = {
                orange: '#ff7900', // Orange vif
                moov: '#005baa', // Bleu foncé
                mtn: '#ffcc00', // Jaune doré
            };
            return operatorColors[operators[0]] || '#6b7280';
        }

        // Priorité 2 : Couleur basée sur le type de signalement (fallback)
        const typeColors: Record<ReportType, string> = {
            zob: '/src/assets/images/icones/report_zb.svg',
            cpo: '/src/assets/images/icones/report_cpo.svg',
            cps: '/src/assets/images/icones/report_cps.svg',
            abi: '#475569',
        };

        return typeColors[report.report_type] || '#6b7280';
    }

    // private getReportIcon(type: ReportType): string {
    //     const icons: Record<ReportType, string> = {
    //         zob: 'X',
    //         cpo: '!',
    //         cps: '~',
    //         abi: '@',
    //     };

    //     return icons[type];
    // }

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

    private createAuthenticatedTileLoadFunction() {
        return (tile: any, url: string): void => {
            tile.setLoader(
                async (
                    extent: unknown,
                    _resolution: unknown,
                    projection: unknown
                ) => {
                    try {
                        const response = await fetch(url, {
                            headers: this.buildTileRequestHeaders(),
                        });

                        if (!response.ok) {
                            tile.setFeatures([]);
                            return;
                        }

                        const data = await response.arrayBuffer();
                        const format = tile.getFormat();
                        const features = format.readFeatures(data, {
                            extent,
                            featureProjection: projection,
                        });

                        tile.setFeatures(features);
                    } catch {
                        tile.setFeatures([]);
                    }
                }
            );
        };
    }

    private buildTileRequestHeaders(): HeadersInit {
        const headers: Record<string, string> = {
            'X-Environment': this.configurationService.environment,
        };
        const tokenData: AuthToken | null =
            this.encodingService.getData('token_data');
        const token = tokenData?.value;

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
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
