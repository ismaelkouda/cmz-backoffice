// map-management.component.ts
import { isPlatformBrowser } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Inject,
    Input,
    NgZone,
    OnDestroy,
    OnInit,
    PLATFORM_ID,
    signal,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

// OpenLayers types
import {
    DEFAULT_MAP_CONFIG,
    GeolocationState,
    MapConfig,
    MapCoordinates,
    MapViewState,
} from '@presentation/pages/reports-processing/data/types/map.type';
import Feature from 'ol/Feature';
import Geolocation from 'ol/Geolocation';
import Map from 'ol/Map';
import Point from 'ol/geom/Point';
import TileLayer from 'ol/layer/Tile';
import {
    OpenLayersLoaderService,
    OpenLayersModules,
} from './service/openlayers-loader.service';
@Component({
    selector: 'app-map-management',
    templateUrl: './map-management.component.html',
    styleUrls: ['./map-management.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapManagementComponent
    implements OnInit, AfterViewInit, OnDestroy
{
    // Reactive state with signals
    readonly isMapInitialized = signal(false);
    readonly isGeolocationAvailable = signal(false);
    readonly geolocationState = signal<GeolocationState>({
        isTracking: false,
        accuracy: null,
        lastUpdate: null,
        error: null,
    });

    readonly mapViewState = signal<MapViewState>({
        latitude: 0,
        longitude: 0,
        zoom: 2,
        rotation: 0,
    });

    // Input properties
    @Input() set latitude(value: number | undefined) {
        if (value !== undefined && this.isValidCoordinate(value, 'latitude')) {
            this.mapViewState.update((state) => ({
                ...state,
                latitude: value,
            }));
            this.updateMapCenter();
        }
    }

    @Input() set longitude(value: number | undefined) {
        if (value !== undefined && this.isValidCoordinate(value, 'longitude')) {
            this.mapViewState.update((state) => ({
                ...state,
                longitude: value,
            }));
            this.updateMapCenter();
        }
    }

    @Input() set zoom(value: number | undefined) {
        const minZoom = this.resolvedConfig.minZoom;
        const maxZoom = this.resolvedConfig.maxZoom;

        if (value !== undefined && value >= minZoom && value <= maxZoom) {
            this.mapViewState.update((state) => ({ ...state, zoom: value }));
            this.updateMapZoom();
        }
    }

    @Input()
    set config(value: Partial<MapConfig>) {
        this.resolvedConfig = { ...DEFAULT_MAP_CONFIG, ...value };
        this.mapViewState.update((state) => ({
            ...state,
            latitude: this.resolvedConfig.center.latitude,
            longitude: this.resolvedConfig.center.longitude,
            zoom: this.resolvedConfig.zoom,
        }));
    }

    // Private properties
    private map: Map | null = null;
    private geolocation: Geolocation | null = null;
    private positionFeature: Feature<Point> | null = null;
    private accuracyFeature: Feature | null = null;
    private destroy$ = new Subject<void>();
    private resizeObserver: ResizeObserver | null = null;

    private resolvedConfig: MapConfig;
    private olModules: OpenLayersModules | null = null;

    constructor(
        private elementRef: ElementRef,
        private ngZone: NgZone,
        private openLayersLoader: OpenLayersLoaderService,
        @Inject(PLATFORM_ID) private platformId: object
    ) {
        this.resolvedConfig = { ...DEFAULT_MAP_CONFIG };
    }

    ngOnInit(): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        this.initializeGeolocationCapability();
    }

    async ngAfterViewInit(): Promise<void> {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        try {
            await this.initializeMap();
            this.setupResizeObserver();
        } catch (error) {
            console.error("Échec de l'initialisation de la carte:", error);
            this.isMapInitialized.set(false);
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.cleanupMap();
    }

    /**
     * Initialisation de la carte avec gestion typée
     */
    private async initializeMap(): Promise<void> {
        try {
            this.olModules = await this.openLayersLoader.loadModulesPromise();

            if (!this.olModules) {
                throw new Error('Impossible de charger les modules OpenLayers');
            }

            await this.ngZone.runOutsideAngular(() => {
                this.createMap();
                this.setupMapEventListeners();

                if (
                    this.resolvedConfig.enableGeolocation &&
                    this.isGeolocationAvailable()
                ) {
                    this.initializeGeolocation();
                }

                this.isMapInitialized.set(true);

                setTimeout(() => this.map?.updateSize(), 100);
            });
        } catch (error) {
            console.error("Échec de l'initialisation de la carte:", error);
            throw error;
        }
    }

    /**
     * Création de la carte OpenLayers
     */
    private createMap(): void {
        if (!this.olModules) {
            throw new Error('Modules OpenLayers non chargés');
        }

        const { Map, View, fromLonLat, defaults } = this.olModules;

        const mapContainer =
            this.elementRef.nativeElement.querySelector('.map-container');
        if (!mapContainer) {
            throw new Error('Container de carte non trouvé');
        }

        this.map = new Map({
            target: mapContainer,
            layers: [this.createBaseLayer()],
            controls: this.resolvedConfig.showControls ? defaults() : [],
            view: new View({
                center: fromLonLat([
                    this.mapViewState().longitude,
                    this.mapViewState().latitude,
                ]),
                zoom: this.mapViewState().zoom,
                minZoom: this.resolvedConfig.minZoom,
                maxZoom: this.resolvedConfig.maxZoom,
                enableRotation: this.resolvedConfig.enableRotation,
                constrainResolution: this.resolvedConfig.constrainResolution,
            }),
        });
    }

    /**
     * Création de la couche de base
     */
    private createBaseLayer(): TileLayer {
        if (!this.olModules) {
            throw new Error('Modules OpenLayers non chargés');
        }

        const { TileLayer, OSM } = this.olModules;

        return new TileLayer({
            source: new OSM({
                attributions: [
                    '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributeurs',
                ],
            }),
            opacity: 0.9,
        });
    }

    /**
     * Vérification de la capacité de géolocalisation
     */
    private initializeGeolocationCapability(): void {
        const isAvailable =
            'geolocation' in navigator && isPlatformBrowser(this.platformId);
        this.isGeolocationAvailable.set(isAvailable);
    }

    /**
     * Initialisation de la géolocalisation
     */
    private initializeGeolocation(): void {
        if (!this.olModules || !this.map || !this.isGeolocationAvailable()) {
            return;
        }

        try {
            const { Geolocation } = this.olModules;

            this.geolocation = new Geolocation({
                trackingOptions: {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 30000,
                },
                projection: this.map.getView().getProjection(),
            });

            this.setupGeolocationFeatures();
            this.setupGeolocationEvents();

            this.geolocation.setTracking(true);
            this.geolocationState.update((state) => ({
                ...state,
                isTracking: true,
            }));
        } catch (error) {
            console.warn(
                "Échec de l'initialisation de la géolocalisation:",
                error
            );
            this.geolocationState.update((state) => ({
                ...state,
                error: 'Géolocalisation non disponible',
                isTracking: false,
            }));
        }
    }

    /**
     * Configuration des features de géolocalisation
     */
    private setupGeolocationFeatures(): void {
        if (!this.olModules || !this.geolocation || !this.map) {
            return;
        }

        const {
            Feature,
            Point,
            VectorLayer,
            VectorSource,
            Style,
            Circle,
            Fill,
            Stroke,
        } = this.olModules;

        this.positionFeature = new Feature();
        this.accuracyFeature = new Feature();

        const positionStyle = new Style({
            image: new Circle({
                radius: 8,
                fill: new Fill({ color: '#3399CC' }),
                stroke: new Stroke({ color: '#FFFFFF', width: 3 }),
            }),
        });

        const accuracyStyle = new Style({
            fill: new Fill({ color: 'rgba(51, 153, 204, 0.2)' }),
            stroke: new Stroke({ color: 'rgba(51, 153, 204, 0.8)', width: 2 }),
        });

        this.positionFeature.setStyle(positionStyle);
        this.accuracyFeature.setStyle(accuracyStyle);

        const source = new VectorSource({
            features: [this.positionFeature, this.accuracyFeature],
        });

        const layer = new VectorLayer({ source });
        this.map.addLayer(layer);
    }

    /**
     * Configuration des événements de géolocalisation
     */
    private setupGeolocationEvents(): void {
        if (!this.geolocation || !this.olModules) {
            return;
        }

        this.geolocation.on('change', () => {
            const coordinates = this.geolocation!.getPosition();
            const accuracy = this.geolocation!.getAccuracy();

            if (coordinates && this.positionFeature) {
                this.positionFeature.setGeometry(
                    new this.olModules!.Point(coordinates)
                );

                this.geolocationState.update((state) => ({
                    ...state,
                    accuracy: accuracy ?? null,
                    lastUpdate: new Date(),
                }));

                const currentZoom = this.map?.getView().getZoom();
                if (currentZoom && currentZoom < 10) {
                    this.map?.getView().animate({
                        center: coordinates,
                        zoom: 12,
                        duration: 1000,
                    });
                }
            }
        });

        this.geolocation.on('change:accuracyGeometry', () => {
            const accuracyGeometry = this.geolocation!.getAccuracyGeometry();
            if (accuracyGeometry && this.accuracyFeature) {
                this.accuracyFeature.setGeometry(accuracyGeometry);
            }
        });

        this.geolocation.on('error', (error: any) => {
            console.warn('Erreur de géolocalisation:', error);
            this.geolocationState.update((state) => ({
                ...state,
                error: error.message,
                isTracking: false,
            }));
        });
    }

    /**
     * Configuration des événements de la carte
     */
    private setupMapEventListeners(): void {
        if (!this.map || !this.olModules) {
            return;
        }

        this.map.getView().on('change:center', () => {
            const center = this.map!.getView().getCenter();
            if (center) {
                const [longitude, latitude] = this.olModules!.toLonLat(center);
                this.mapViewState.update((state) => ({
                    ...state,
                    longitude,
                    latitude,
                }));
            }
        });

        this.map.getView().on('change:resolution', () => {
            const zoom = this.map!.getView().getZoom();
            if (zoom !== undefined) {
                this.mapViewState.update((state) => ({ ...state, zoom }));
            }
        });
    }

    /**
     * Configuration du ResizeObserver avec debounce correct
     */
    private setupResizeObserver(): void {
        if (typeof ResizeObserver !== 'function') {
            return;
        }

        const container =
            this.elementRef.nativeElement.querySelector('.map-container');
        if (!container) {
            return;
        }

        // Solution propre pour le debounce avec ResizeObserver
        let resizeTimeout: number | undefined;

        const handleResize = (entries: ResizeObserverEntry[]) => {
            if (resizeTimeout) {
                window.clearTimeout(resizeTimeout);
            }
            resizeTimeout = window.setTimeout(() => {
                this.map?.updateSize();
                resizeTimeout = undefined;
            }, 100);
        };

        this.resizeObserver = new ResizeObserver(handleResize);
        this.resizeObserver.observe(container);

        // Cleanup simplifié sans fromEvent
        this.destroy$.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.resizeObserver?.disconnect();
        });
    }

    /**
     * Validation des coordonnées
     */
    private isValidCoordinate(
        value: number,
        type: 'latitude' | 'longitude'
    ): boolean {
        const limits = {
            latitude: { min: -90, max: 90 },
            longitude: { min: -180, max: 180 },
        };
        const limit = limits[type];
        return !isNaN(value) && value >= limit.min && value <= limit.max;
    }

    /**
     * Mise à jour du centre de la carte
     */
    private updateMapCenter(): void {
        if (!this.map || !this.olModules) {
            return;
        }

        const { latitude, longitude } = this.mapViewState();
        this.map.getView().animate({
            center: this.olModules.fromLonLat([longitude, latitude]),
            duration: 500,
        });
    }

    /**
     * Mise à jour du zoom
     */
    private updateMapZoom(): void {
        if (!this.map) {
            return;
        }

        this.map.getView().animate({
            zoom: this.mapViewState().zoom,
            duration: 500,
        });
    }

    /**
     * Nettoyage des ressources
     */
    private cleanupMap(): void {
        if (this.geolocation) {
            this.geolocation.setTracking(false);
        }

        if (this.map) {
            this.map.setTarget(undefined);
            this.map.dispose();
        }

        this.resizeObserver?.disconnect();
    }

    // Public API methods
    public hasValidCoordinates(): boolean {
        const { latitude, longitude } = this.mapViewState();
        return (
            this.isValidCoordinate(latitude, 'latitude') &&
            this.isValidCoordinate(longitude, 'longitude')
        );
    }

    public toggleGeolocation(enable: boolean): void {
        if (this.geolocation) {
            this.geolocation.setTracking(enable);
            this.geolocationState.update((state) => ({
                ...state,
                isTracking: enable,
            }));
        }
    }

    public getCurrentCoordinates(): MapCoordinates {
        const { latitude, longitude } = this.mapViewState();
        return { latitude, longitude };
    }

    public updateMapSize(): void {
        this.map?.updateSize();
    }
}
