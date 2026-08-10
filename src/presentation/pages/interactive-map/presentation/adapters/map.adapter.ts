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
import { getReportTypeIconPath } from '@shared/domain/constants/report-icon';
import { AuthToken } from '@shared/domain/interfaces/current-user.interface';
import { EncodingDataService } from '@shared/domain/services/encoding-data.service';
import { defaults as defaultControls } from 'ol/control';
import { Coordinate } from 'ol/coordinate';
import Feature from 'ol/Feature';
import { FeatureLike } from 'ol/Feature';
import MVT from 'ol/format/MVT';
import Point from 'ol/geom/Point';
import LineString from 'ol/geom/LineString';
import Polygon from 'ol/geom/Polygon';
import HeatmapLayer from 'ol/layer/Heatmap';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorTileLayer from 'ol/layer/VectorTile';
import Map from 'ol/Map';
import Overlay from 'ol/Overlay';
import { fromLonLat, toLonLat, transformExtent } from 'ol/proj';
import { XYZ } from 'ol/source';
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
    defaultCenter?: { lat: number; lng: number }; // pour le reset
    defaultZoom?: number;
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
    minLat: 3.02355, // 0.5 + 0.25
    maxLat: 13.85845, // 14.0 + 0.25
    minLng: -12.98611, // -13.0 + 0.25
    maxLng: 1.00542, // 2.5 + 0.25
};

export class MapAdapter {
    private coverageCenterLayer!: VectorTileLayer;
    private defaultCenter: { lat: number; lng: number } = {
        lat: 7.984430480342013,
        lng: -3.756106463052295,
    };
    private defaultZoom = 5;
    private osmLayer!: TileLayer;
    private satelliteLayer!: TileLayer;
    private coverageOperatorsVisible: Record<string, boolean> = {
        idt: true,
        'moov (coloas)': true,
        'ihs (mtn)': true,
        ihs: true,
        cit: true,
        moov: true,
        presidence: true,
        oci: true,
        mtn: true,
        'ihs (oci)': true,
        'cafe mobile': true,
        green: true,
    };

    private static readonly CLUSTER_MIN_RADIUS = 18;
    private static readonly CLUSTER_MAX_RADIUS = 34;

    private static readonly MARKER_MIN_RADIUS = 5;
    private static readonly MARKER_MAX_RADIUS = 9;

    private static readonly COVERAGE_MARKER_MIN_RADIUS = 6;
    private static readonly COVERAGE_MARKER_MAX_RADIUS = 14;

    private static readonly CLUSTER_DISTANCE = 42;
    private static readonly CLUSTER_MIN_DISTANCE = 18;
    /** Zones visibles uniquement au-delà de ce zoom ; centres toujours visibles si cochés. */
    private static readonly COVERAGE_ZONES_MIN_ZOOM = 11.35;
    private static readonly MAP_ICON_MIN_ZOOM = 7;
    private static readonly MAP_ICON_MAX_ZOOM = 18;
    /**
     * Tailles écran (px) des icônes — style Google Maps :
     * plus petites à faible zoom, légèrement plus grandes en zoomant.
     * (Les SVG report font intrinsèquement 800px : on force width/height.)
     */
    private static readonly REPORT_ICON_MIN_PX = 20;
    private static readonly REPORT_ICON_MAX_PX = 50;
    private static readonly SIGNAL_ICON_MIN_PX = 20;
    private static readonly SIGNAL_ICON_MAX_PX = 20;

    private readonly ngZone = inject(NgZone);
    private readonly encodingService = inject(EncodingDataService);
    private readonly configurationService = inject(ConfigurationService);

    private map: Map | null = null;
    private hoverOverlay: Overlay | null = null;
    private clickOverlay: Overlay | null = null;
    private selectedReportId: string | number | null = null;
    private suppressMoveEndUntil = 0;
    private lastBounds: Bounds | null = null;
    private coverageZonesUserVisible = false;
    private coverageCentersUserVisible = false;
    private coverageTilesActive = false;
    private coverageZonesDisplayMode = false;
    private lastMapIconZoomBucket: number | null = null;
    private lastCoverageLayerVisibility: {
        areaTiles: boolean;
        centerTiles: boolean;
    } | null = null;
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
        zIndex: 10,
    });
    private readonly coverageAreaLayer = new VectorTileLayer({
        declutter: false,
        renderMode: 'hybrid',
        style: (feature): Style => this.createCoverageAreaTileStyle(feature),
        visible: false,
        zIndex: 3,
    });
    private equipmentTypesVisible: Record<string, boolean> = {
        education: true,
        sante: true,
        administration: true,
        securité: true,
    };
    /** Une couche VectorTile par sélection d'équipements (API ?tag=). */
    private readonly equipmentAreaLayers = new globalThis.Map<
        string,
        VectorTileLayer
    >();
    private readonly equipmentAreaLayer = new VectorTileLayer({
        // Pas de declutter OL : le clustering est côté backend sur les tuiles.
        declutter: false,
        renderMode: 'hybrid',
        style: (feature): Style => this.createEquipmentAreaTileStyle(feature),
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
    private readonly zoomChangeSubject = new Subject<number>();

    init(container: HTMLElement, options: MapOptions): void {
        if (this.map) {
            return;
        }
        const mergedOptions = { ...options };
        this.osmLayer = new TileLayer({
            source: new OSM({
                attributions: [
                    '© <a href="https://ansut.ci" target="_blank">ANSUT</a>',
                ],
            }),
            visible: true,
            zIndex: 0,
        });
        this.satelliteLayer = new TileLayer({
            source: new XYZ({
                url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                maxZoom: 19,
                attributions: '...',
            }),
            visible: false,
            zIndex: 0,
        });

        this.map = new Map({
            target: container,
            controls: defaultControls({ zoom: true }),
            layers: [
                this.osmLayer,
                this.satelliteLayer,
                // this.coverageAreaLayer,
                this.equipmentAreaLayer,
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
                // extent: transformExtent(
                //     [
                //         IVORY_COAST_BOUNDS.minLng,
                //         IVORY_COAST_BOUNDS.minLat,
                //         IVORY_COAST_BOUNDS.maxLng,
                //         IVORY_COAST_BOUNDS.maxLat,
                //     ],
                //     'EPSG:4326',
                //     'EPSG:3857'
                // ),
            }),
        });
        this.coverageCenterLayer = new VectorTileLayer({
            declutter: true,
            renderMode: 'hybrid',
            style: (feature): Style =>
                this.createCoverageCenterTileStyle(feature),
            visible: false,
            zIndex: 4,
        });

        this.map.addLayer(this.coverageAreaLayer);
        this.map.addLayer(this.coverageCenterLayer);
        this.setupMapViewListeners();
        this.setupClickListener();
        this.setupPointerMoveListener();

        const initialZoom = this.map.getView().getZoom() ?? 0;
        this.coverageZonesDisplayMode =
            this.shouldShowCoverageZones(initialZoom);

        this.defaultCenter = options.defaultCenter || options.center;
        this.defaultZoom = options.defaultZoom || options.zoom;
    }

    setBaseMap(type: 'osm' | 'satellite'): void {
        if (!this.map) {
            return;
        }
        if (type === 'osm') {
            this.osmLayer.setVisible(true);
            this.satelliteLayer.setVisible(false);
        } else {
            this.osmLayer.setVisible(false);
            this.satelliteLayer.setVisible(true);
        }
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

    /** Émet le niveau de zoom courant à chaque changement (pinch/molette/+/-). */
    onZoomChange(): Observable<number> {
        return this.zoomChangeSubject.asObservable();
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
            this.coverageCenterLayer.setSource(null);
            this.coverageCenterLayer.setVisible(false);
            this.coverageTilesActive = false;
            this.lastCoverageLayerVisibility = null;
            return;
        }

        this.coverageTilesActive = true;

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
        const source = new VectorTileSource({
            format: new MVT({
                layers: ['coverage_areas'],
                idProperty: 'id',
            }),
            maxZoom: 22,
            transition: 160,
            url: tileUrl,
            wrapX: false,
            tileLoadFunction: this.createAuthenticatedTileLoadFunction(),
        });

        this.coverageCenterLayer.setSource(source);
        this.lastCoverageLayerVisibility = null;
        this.updateCoverageLayersVisibility();
    }

    setCoverageZonesVisible(visible: boolean): void {
        this.coverageZonesUserVisible = visible;
        this.lastCoverageLayerVisibility = null;
        this.updateCoverageLayersVisibility();
    }

    setCoverageCentersVisible(visible: boolean): void {
        this.coverageCentersUserVisible = visible;
        this.lastCoverageLayerVisibility = null;
        this.updateCoverageLayersVisibility();
    }

    setCoverageAreasVisible(visible: boolean): void {
        this.coverageAreaLayer.setVisible(visible);
    }

    renderEquipmentAreaTiles(
        tileLayers:
            | {
                  type: string;
                  url: string;
                  selectedTypes?: string[];
              }[]
            | null
    ): void {
        this.clearEquipmentAreaLayers();

        if (!this.map || !tileLayers?.length) {
            return;
        }

        for (const { type, url, selectedTypes } of tileLayers) {
            if (!url) {
                continue;
            }

            if (selectedTypes?.length) {
                for (const key of Object.keys(this.equipmentTypesVisible)) {
                    this.equipmentTypesVisible[key] = false;
                }
                for (const selected of selectedTypes) {
                    this.equipmentTypesVisible[selected] = true;
                }
            } else {
                this.equipmentTypesVisible[type] = true;
            }

            const layer = new VectorTileLayer({
                // Clustering géré par le backend (MVT + point_count).
                // Pas de Cluster OL ni declutter côté front sur ces tuiles.
                declutter: false,
                renderMode: 'hybrid',
                style: (feature): Style =>
                    this.createEquipmentAreaTileStyle(
                        feature,
                        selectedTypes?.length ? undefined : type
                    ),
                visible: true,
                zIndex: 1,
            });

            layer.setSource(
                new VectorTileSource({
                    // Pas de restriction de layer MVT : le clustering backend
                    // peut exposer des noms de layers différents.
                    format: new MVT({
                        idProperty: 'id',
                    }),
                    maxZoom: 22,
                    transition: 160,
                    url,
                    wrapX: false,
                    tileLoadFunction:
                        this.createAuthenticatedTileLoadFunction(),
                })
            );

            this.equipmentAreaLayers.set(type, layer);
            this.map.addLayer(layer);
        }
    }

    setEquipmentAreasVisible(visible: boolean): void {
        this.equipmentAreaLayer.setVisible(visible);
        for (const layer of this.equipmentAreaLayers.values()) {
            layer.setVisible(visible);
        }
    }

    private clearEquipmentAreaLayers(): void {
        for (const [type, layer] of this.equipmentAreaLayers) {
            layer.setSource(null);
            this.map?.removeLayer(layer);
            this.equipmentAreaLayers.delete(type);
        }
        this.equipmentAreaLayer.setSource(null);
        this.equipmentAreaLayer.setVisible(false);
    }

    private setupMapViewListeners(): void {
        if (!this.map) {
            return;
        }

        this.map.getView().on('change:resolution', () => {
            const zoom = this.map?.getView().getZoom() ?? 0;
            const showZones = this.shouldShowCoverageZones(zoom);

            if (showZones !== this.coverageZonesDisplayMode) {
                this.coverageZonesDisplayMode = showZones;
            }

            this.updateCoverageLayersVisibility();
            this.refreshMapIconLayersForZoom(zoom);
            this.zoomChangeSubject.next(zoom);
        });

        this.map.on('moveend', () => {
            if (Date.now() < this.suppressMoveEndUntil) {
                return;
            }

            const bounds = this.getConstrainedBounds();
            if (bounds) {
                this.lastBounds = bounds;
                this.moveEndSubject.next(bounds);
            }

            this.updateCoverageLayersVisibility();
        });
    }

    private shouldShowCoverageZones(zoom: number): boolean {
        return zoom > MapAdapter.COVERAGE_ZONES_MIN_ZOOM;
    }

    private getCoverageRadiusMeters(
        properties: CoverageAreaProperties
    ): number | null {
        const raw =
            properties?.radius ??
            properties?.['coverage_radius'] ??
            properties?.['rayon'];
        const value = Number(raw);
        return Number.isFinite(value) && value > 0 ? value : null;
    }

    private updateCoverageLayersVisibility(): void {
        if (!this.map || !this.coverageTilesActive) {
            return;
        }

        const zoom = this.map.getView().getZoom() ?? 0;
        const showZones = this.shouldShowCoverageZones(zoom);
        const hasTileSource = this.coverageAreaLayer.getSource() !== null;

        const nextVisibility = {
            areaTiles:
                showZones && this.coverageZonesUserVisible && hasTileSource,
            centerTiles: this.coverageCentersUserVisible && hasTileSource,
        };

        const prev = this.lastCoverageLayerVisibility;
        const changed =
            !prev ||
            prev.areaTiles !== nextVisibility.areaTiles ||
            prev.centerTiles !== nextVisibility.centerTiles;

        if (!changed) {
            return;
        }

        this.lastCoverageLayerVisibility = nextVisibility;
        this.coverageAreaLayer.setVisible(nextVisibility.areaTiles);
        this.coverageCenterLayer.setVisible(nextVisibility.centerTiles);

        if (nextVisibility.areaTiles) {
            this.coverageAreaLayer.changed();
        }
        if (nextVisibility.centerTiles) {
            this.coverageCenterLayer.changed();
        }
    }

    setEquipmentTypeVisible(type: string, visible: boolean): void {
        this.equipmentTypesVisible[type] = visible;
        this.equipmentAreaLayer.changed();
        const layer = this.equipmentAreaLayers.get(type);
        if (layer) {
            layer.setVisible(visible);
            layer.changed();
        }
        for (const equipmentLayer of this.equipmentAreaLayers.values()) {
            equipmentLayer.changed();
        }
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
        this.zoomChangeSubject.complete();
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
        const operator = this.normalizeOperatorName(
            this.getFeatureOperatorValue(coverageArea)
        );

        if (!operator || !this.coverageOperatorsVisible[operator]) {
            return new Style({});
        }

        const radiusInMeters = this.getCoverageRadiusMeters(coverageArea);
        if (radiusInMeters === null) {
            // Pas de rayon fourni par le backend (point encore agrégé en
            // cluster à ce niveau de zoom) : on n'affiche rien plutôt
            // qu'une icône de repère symbolique. Seul le cercle réel,
            // fourni automatiquement par le backend, doit apparaître.
            return new Style({});
        }

        const color = this.getCoverageAreaColor(operator);
        const markerRadius = this.metersToPixels(radiusInMeters);

        return new Style({
            image: new CircleStyle({
                radius: markerRadius,
                fill: new Fill({ color: this.hexToRgba(color, 0.35) }),
                stroke: new Stroke({
                    color: color,
                    width: 2.5,
                    lineDash: [4, 4],
                }),
            }),
        });
    }

    private createCoverageCenterTileStyle(feature: FeatureLike): Style {
        const properties = feature.getProperties() as CoverageAreaProperties;
        const operator = this.normalizeOperatorName(
            this.getFeatureOperatorValue(properties)
        );

        if (!operator || !this.coverageOperatorsVisible[operator]) {
            return new Style({});
        }

        return new Style({
            image: new Icon({
                src: 'assets/images/icones/signal.svg',
                width: this.getSignalIconPixelSize(),
                height: this.getSignalIconPixelSize(),
                anchor: [0.5, 0.5],
            }),
        });
    }

    /**
     * Style des tuiles équipements.
     * Le backend clusterise déjà (point_count / count) : on affiche tel quel,
     * sans re-cluster OpenLayers.
     * @param feature
     * @param forcedType
     */
    private createEquipmentAreaTileStyle(
        feature: FeatureLike,
        forcedType?: string
    ): Style {
        const properties = feature.getProperties() as {
            type?: string;
            equipment_type?: string;
            tag?: string;
            point_count?: number | string;
            cluster_count?: number | string;
            count?: number | string;
        };

        const type =
            forcedType ||
            this.normalizeEquipmentType(
                properties?.equipment_type ??
                    properties?.type ??
                    properties?.tag
            );

        const anySelected = Object.values(this.equipmentTypesVisible).some(
            Boolean
        );
        if (type && this.equipmentTypesVisible[type] === false) {
            return new Style({});
        }
        if (!type && !anySelected && !forcedType) {
            return new Style({});
        }

        const clusterCount = this.getBackendClusterCount(properties);
        const color = this.getEquipmentAreaColor(type || forcedType);

        // Agrégat backend → pastille avec le nombre fourni par l'API.
        if (clusterCount > 1) {
            return this.createEquipmentBackendClusterStyle(clusterCount, color);
        }

        // Point individuel : marqueur simple (pas de rayon / faux cluster).
        return new Style({
            image: new CircleStyle({
                radius: 7,
                fill: new Fill({ color }),
                stroke: new Stroke({ color: '#ffffff', width: 2 }),
            }),
        });
    }

    private getBackendClusterCount(properties: {
        point_count?: number | string;
        cluster_count?: number | string;
        count?: number | string;
    }): number {
        const raw =
            properties?.point_count ??
            properties?.cluster_count ??
            properties?.count;
        const value = Number(raw);
        return Number.isFinite(value) && value > 1 ? value : 0;
    }

    private createEquipmentBackendClusterStyle(
        count: number,
        color: string
    ): Style {
        const radius = Math.min(16 + Math.floor(count / 10), 32);

        return new Style({
            image: new CircleStyle({
                radius,
                fill: new Fill({ color }),
                stroke: new Stroke({ color: '#ffffff', width: 2.5 }),
            }),
            text: new Text({
                text: String(count),
                fill: new Fill({ color: '#ffffff' }),
                font: '700 12px Lato, Arial, sans-serif',
            }),
        });
    }

    private coverageAreaClusterStyleFunction(
        _feature: FeatureLike
    ): Style | Style[] {
        console.log(_feature);
        return new Style({});
    }

    private createSingleCoverageAreaStyle(
        properties: CoverageAreaProperties
    ): Style {
        const operator =
            this.normalizeOperatorName(
                this.getFeatureOperatorValue(properties)
            ) || 'open';
        const color = this.getCoverageAreaColor(operator);
        const radiusInMeters = Number(properties?.radius);
        const markerRadius = Number.isFinite(radiusInMeters)
            ? this.metersToPixels(radiusInMeters)
            : 15;

        return new Style({
            image: new CircleStyle({
                radius: markerRadius,
                fill: new Fill({ color: this.hexToRgba(color, 0.35) }),
                stroke: new Stroke({
                    color: color,
                    width: 2.5,
                    lineDash: [4, 4],
                }),
            }),
        });
    }

    private getEquipmentAreaColor(type?: string): string {
        const colors: Record<string, string> = {
            education: '#1d4ed8',
            sante: '#dc2626',
            administration: '#7c3aed',
            securité: '#059669',
        };
        return type ? colors[type] || '#6b7280' : '#6b7280';
    }

    private normalizeEquipmentType(value: unknown): string | undefined {
        if (typeof value !== 'string') {
            return undefined;
        }
        const normalized = value
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .trim()
            .toLowerCase();

        for (const key of Object.keys(this.equipmentTypesVisible)) {
            const keyNorm = key
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .toLowerCase();
            if (keyNorm === normalized) {
                return key;
            }
        }
        return undefined;
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

        const iconPath = this.getReportIcon(report.report_type);

        if (iconPath) {
            const size = this.getReportIconPixelSize();
            return new Style({
                image: new Icon({
                    src: iconPath,
                    width: size,
                    height: size,
                    anchor: [0.5, 0.5],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'fraction',
                }),
            });
        }

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
        return getReportTypeIconPath(type);
    }

    private refreshMapIconLayersForZoom(zoom: number): void {
        // Buckets de 0.25 de zoom pour un redimensionnement fluide type Maps.
        const zoomBucket = Math.round(zoom * 4);

        if (zoomBucket === this.lastMapIconZoomBucket) {
            return;
        }

        this.lastMapIconZoomBucket = zoomBucket;
        this.clusterLayer.changed();
        this.coverageCenterLayer.changed();
    }

    /**
     * Interpolation douce de taille d'icône selon le zoom (écran px).
     * Courbe sub-linéaire : la taille croît un peu plus vite en bas du
     * range, comme les POI Google Maps.
     * @param minPx
     * @param maxPx
     */
    private getZoomIconPixelSize(minPx: number, maxPx: number): number {
        if (!this.map) {
            return Math.round((minPx + maxPx) / 2);
        }

        const zoom = this.map.getView().getZoom() ?? 10;
        const t = Math.min(
            Math.max(
                (zoom - MapAdapter.MAP_ICON_MIN_ZOOM) /
                    (MapAdapter.MAP_ICON_MAX_ZOOM -
                        MapAdapter.MAP_ICON_MIN_ZOOM),
                0
            ),
            1
        );

        const eased = Math.pow(t, 0.75);
        return Math.round(minPx + eased * (maxPx - minPx));
    }

    private getReportIconPixelSize(): number {
        return this.getZoomIconPixelSize(
            MapAdapter.REPORT_ICON_MIN_PX,
            MapAdapter.REPORT_ICON_MAX_PX
        );
    }

    private getSignalIconPixelSize(): number {
        return this.getZoomIconPixelSize(
            MapAdapter.SIGNAL_ICON_MIN_PX,
            MapAdapter.SIGNAL_ICON_MAX_PX
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

    private getCoverageAreaReportsFromFeature(
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
                .filter((item) => item.get('coverageArea'))
                .map((item) => item.get('report') as InteractiveMapReport)
                .filter(Boolean);
        }

        const report = feature.get('report') as
            | InteractiveMapReport
            | undefined;
        return report && feature.get('coverageArea') ? [report] : [];
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
        const operators = this.normalizeOperators(report.operators);
        if (operators.length > 0) {
            const operatorColors: Record<ReportOperator, string> = {
                orange: '#ff7900',
                moov: '#005baa',
                mtn: '#ffcc00',
            };
            return operatorColors[operators[0]] || '#6b7280';
        }
        const typeColors: Record<ReportType, string> = {
            zob: '#7c3aed',
            cpo: '#0f766e',
            cps: '#be123c',
            abi: '#475569',
        };
        return typeColors[report.report_type] || '#6b7280';
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

    private getCoverageAreaColor(operator?: string): string {
        const colors: Record<string, string> = {
            oci: '#bfef45',
            'ihs (oci)': '#ff7900',
            cit: '#ff7900',
            mtn: '#ffcc00',
            'ihs (mtn)': '#ffcc00',
            moov: '#005baa',
            'moov (coloas)': '#005baa',
            idt: '#e6194B',
            ihs: '#bfef45',
            presidence: '#4363d8',
            'cafe mobile': '#fabed4',
            green: '#469990',
        };
        return operator ? colors[operator] || '#6b7280' : '#6b7280';
    }

    /**
     * Depuis l'optimisation clustering côté backend, les tuiles
     * `coverage_areas` renvoient un champ `operators` (pluriel, ex: "oci"
     * ou "oci,mtn" pour un cluster mêlant plusieurs opérateurs) au lieu du
     * champ `operator` (singulier) utilisé auparavant sur les points
     * individuels. On garde la compatibilité avec les deux noms de champ.
     * @param properties
     */
    private getFeatureOperatorValue(
        properties: CoverageAreaProperties | Record<string, unknown>
    ): unknown {
        return (
            (properties as Record<string, unknown>)?.['operator'] ??
            (properties as Record<string, unknown>)?.['operators']
        );
    }

    private normalizeOperatorName(value: unknown): string | undefined {
        if (typeof value !== 'string') {
            return undefined;
        }
        // Un cluster peut regrouper plusieurs opérateurs séparés par une
        // virgule (ex: "oci,mtn") : on ne garde que le premier pour le
        // rendu du style (couleur/icône).
        const normalized = value.split(',')[0].trim().toLowerCase();
        return normalized in this.coverageOperatorsVisible
            ? normalized
            : undefined;
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

                        // Utiliser le décodage PBF
                        const features = await this.decodePbfTile(
                            data,
                            extent,
                            projection
                        );

                        tile.setFeatures(features);
                    } catch (error) {
                        console.error('Erreur décodage tuile:', error);
                        tile.setFeatures([]);
                    }
                }
            );
        };
    }

    private async decodePbfTile(
        buf: ArrayBuffer,
        extent: unknown,
        projection: unknown
    ): Promise<Feature[]> {
        try {
            // Ne pas restreindre à un nom de layer précis ('coverage_areas') :
            // l'optimisation clustering côté backend a pu renommer/réorganiser
            // les layers du tuilage MVT. Lire tous les layers présents évite
            // de dépendre d'un nom qui peut changer côté serveur.
            const format = new MVT({ idProperty: 'id' });

            const features = format.readFeatures(buf, {
                extent: extent as number[],
                featureProjection: projection as string,
            });

            return features as any as Feature[];
        } catch (error) {
            console.error('Erreur décodage MVT:', error);

            // Fallback: décodage manuel via Pbf/VectorTile (comme la
            // référence Leaflet) si le format MVT d'OpenLayers échoue.
            try {
                return await this.decodePbfManually(buf, extent, projection);
            } catch (fallbackError) {
                console.error('Erreur fallback Pbf:', fallbackError);
                return [];
            }
        }
    }

    private async decodePbfManually(
        buf: ArrayBuffer,
        extent: unknown,
        projection: unknown
    ): Promise<Feature[]> {
        console.log(extent, projection);
        // Charger les scripts Pbf et VectorTile depuis CDN
        await this.loadPbfLibraries();

        const VectorTile = (window as any).VectorTile;
        const Pbf = (window as any).Pbf;

        if (!VectorTile || !Pbf) {
            throw new Error('Pbf libraries non chargées');
        }

        const pbf = new Pbf(new Uint8Array(buf));
        const tile = new VectorTile(pbf);
        const features: Feature[] = [];

        for (const layerName of Object.keys(tile.layers)) {
            const layer = tile.layers[layerName];
            for (let i = 0; i < layer.length; i++) {
                const feat = layer.feature(i);
                const geom = feat.loadGeometry();
                const props = feat.properties || {};
                const extent_val = layer.extent || 4096;

                if (feat.type === 1) {
                    // Points
                    for (const ring of geom as any[]) {
                        for (const pt of ring as any[]) {
                            const coord = fromLonLat([
                                (pt.x / extent_val) * 360 - 180,
                                (180 / Math.PI) *
                                    Math.atan(
                                        Math.sinh(
                                            Math.PI *
                                                (1 - (2 * pt.y) / extent_val)
                                        )
                                    ),
                            ]);
                            const feature = new Feature({
                                geometry: new Point(coord),
                            });
                            Object.entries(props).forEach(([key, value]) => {
                                feature.set(key, value);
                            });
                            features.push(feature);
                        }
                    }
                } else if (feat.type === 2) {
                    // LineStrings
                    const coords = (geom as any[]).map((ring: any) =>
                        ring.map((pt: any) =>
                            fromLonLat([
                                (pt.x / extent_val) * 360 - 180,
                                (180 / Math.PI) *
                                    Math.atan(
                                        Math.sinh(
                                            Math.PI *
                                                (1 - (2 * pt.y) / extent_val)
                                        )
                                    ),
                            ])
                        )
                    );
                    const feature = new Feature({
                        geometry: new LineString(coords[0] || []),
                    });
                    Object.entries(props).forEach(([key, value]) => {
                        feature.set(key, value);
                    });
                    features.push(feature);
                } else if (feat.type === 3) {
                    // Polygons
                    const coords = (geom as any[]).map((ring: any) =>
                        ring.map((pt: any) =>
                            fromLonLat([
                                (pt.x / extent_val) * 360 - 180,
                                (180 / Math.PI) *
                                    Math.atan(
                                        Math.sinh(
                                            Math.PI *
                                                (1 - (2 * pt.y) / extent_val)
                                        )
                                    ),
                            ])
                        )
                    );
                    const feature = new Feature({
                        geometry: new Polygon(coords),
                    });
                    Object.entries(props).forEach(([key, value]) => {
                        feature.set(key, value);
                    });
                    features.push(feature);
                }
            }
        }

        return features;
    }

    private loadPbfLibraries(): Promise<void> {
        return new Promise((resolve, reject) => {
            if ((window as any).VectorTile && (window as any).Pbf) {
                resolve();
                return;
            }

            // Charger Pbf
            const pbfScript = document.createElement('script');
            pbfScript.src = 'https://esm.sh/pbf@3.2.1';
            pbfScript.type = 'module';
            pbfScript.onerror = () =>
                reject(new Error('Pbf script chargement échoué'));

            // Charger VectorTile
            const vectorTileScript = document.createElement('script');
            vectorTileScript.src = 'https://esm.sh/@mapbox/vector-tile@1.3.1';
            vectorTileScript.type = 'module';
            vectorTileScript.onerror = () =>
                reject(new Error('VectorTile script chargement échoué'));

            document.head.appendChild(pbfScript);
            document.head.appendChild(vectorTileScript);

            // Attendre un peu pour que les scripts se chargent
            setTimeout(() => {
                if ((window as any).VectorTile && (window as any).Pbf) {
                    resolve();
                } else {
                    reject(new Error('Pbf libraries timeout'));
                }
            }, 3000);
        });
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

    setCoverageOperatorVisible(operator: string, visible: boolean): void {
        this.coverageOperatorsVisible[operator] = visible;
        this.lastCoverageLayerVisibility = null;
        this.coverageAreaLayer.changed();
        this.coverageCenterLayer.changed();
    }
    resetView(): void {
        if (!this.map) {
            return;
        }
        const view = this.map.getView();
        view.animate({
            center: fromLonLat([
                this.defaultCenter.lng,
                this.defaultCenter.lat,
            ]),
            zoom: this.defaultZoom,
            duration: 500,
        });
    }
}
