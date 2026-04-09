import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    NgZone,
    OnDestroy,
    computed,
    effect,
    inject,
    input,
    signal,
    viewChild,
} from '@angular/core';
import { Coordinates } from '@shared/domain/interfaces/coordinates.interface';
import {
    OpenLayersLoaderService,
    OpenLayersModules,
} from '@shared/domain/services/openlayers-loader.service';
import type { Map } from 'ol';
import type Feature from 'ol/Feature';
import type { Point } from 'ol/geom';
import type { Modify } from 'ol/interaction';

import { LocationStateService } from '../services/location-state.service';
import { isValidCoordinates } from '../utils/coordinates.validator';
import { fromOlCoordinate, toOlCoordinate } from '../utils/projection.utils';

@Component({
    selector: 'app-ol-map',
    standalone: true,
    imports: [CommonModule],
    templateUrl: `./ol-map.component.html`,
    styleUrls: ['./ol-map.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OlMapComponent implements OnDestroy {
    readonly initialCoords = input<Coordinates | null>(null);
    readonly initialZoom = input<number>(15);
    private readonly mapContainer =
        viewChild.required<ElementRef<HTMLDivElement>>('mapContainer');
    private readonly olLoader = inject(OpenLayersLoaderService);
    private readonly ngZone = inject(NgZone);
    private readonly locationState = inject(LocationStateService);
    private map: Map | null = null;
    private markerFeature: Feature<Point> | null = null;
    private vectorLayer!: any;
    private modifyInteraction: Modify | null = null;
    private olModules!: OpenLayersModules;
    readonly isLoading = signal(true);
    readonly error = signal<string | null>(null);
    private readonly initialCenter = computed(() => {
        const coords = this.initialCoords();
        if (coords && isValidCoordinates(coords.latitude, coords.longitude)) {
            return toOlCoordinate(coords.latitude, coords.longitude);
        }
        return toOlCoordinate(5.359952, -4.008256);
    });

    constructor() {
        effect(() => {
            const container = this.mapContainer();
            if (container && !this.map) {
                this.initMap(container.nativeElement);
            }
        });

        effect(() => {
            const coords = this.locationState.selectedCoordinates();
            const marker = this.markerFeature;

            if (coords && marker && this.map) {
                const olCoord = toOlCoordinate(
                    coords.latitude,
                    coords.longitude
                );
                marker.getGeometry()?.setCoordinates(olCoord);

                const currentCenter = this.map.getView().getCenter();
                if (
                    currentCenter &&
                    Math.abs(currentCenter[0] - olCoord[0]) > 0.01
                ) {
                    this.map.getView().setCenter(olCoord);
                }
            }
        });
    }

    private async initMap(container: HTMLElement): Promise<void> {
        try {
            this.isLoading.set(true);
            this.error.set(null);

            this.olModules = await this.olLoader.loadModulesPromise();

            if (!this.olModules) {
                throw new Error('Modules OpenLayers non chargés');
            }

            await this.ngZone.runOutsideAngular(async () => {
                await this.createMap(container);
                this.setupInteractions();
            });

            this.isLoading.set(false);
        } catch (err) {
            console.error('[OlMap] Initialization failed:', err);
            this.error.set(
                'Impossible de charger la carte. Vérifiez votre connexion.'
            );
            this.isLoading.set(false);
        }
    }

    private async createMap(container: HTMLElement): Promise<void> {
        const { Map, View, TileLayer, OSM, Interactions } = this.olModules;

        const osmLayer = new TileLayer({
            source: new OSM({
                attributions: [
                    '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                ],
            }),
        });

        this.map = new Map({
            target: container,
            layers: [osmLayer],
            view: new View({
                center: this.initialCenter(),
                zoom: this.initialZoom(),
                minZoom: 2,
                maxZoom: 18,
            }),
            interactions: Interactions({
                mouseWheelZoom: true,
                dragPan: true,
            }),
        });

        // Création de la couche vectorielle pour le marqueur
        const VectorLayer = (await import('ol/layer/Vector')).default;
        const VectorSource = (await import('ol/source/Vector')).default;

        this.vectorLayer = new VectorLayer({
            source: new VectorSource(),
        });

        this.map.addLayer(this.vectorLayer);

        await this.createMarker();
    }

    private async createMarker(): Promise<void> {
        if (!this.map || !this.vectorLayer) {
            return;
        }

        const Feature = (await import('ol/Feature')).default;
        const Point = (await import('ol/geom/Point')).default;
        const { Icon, Style } = await import('ol/style');

        const markerStyle = new Style({
            image: new Icon({
                src: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // À remplacer par votre asset local
                scale: 0.08,
                anchor: [0.5, 1],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
            }),
        });

        // Position initiale
        const initialCoord = this.initialCenter();

        this.markerFeature = new Feature({
            geometry: new Point(initialCoord),
        }) as Feature<Point>;

        this.markerFeature.setStyle(markerStyle);
        this.vectorLayer.getSource()?.addFeature(this.markerFeature);
    }

    private setupInteractions(): void {
        if (!this.map || !this.vectorLayer) {
            return;
        }

        this.ngZone.runOutsideAngular(async () => {
            const Modify = (await import('ol/interaction/Modify')).default;

            // Interaction pour déplacer le marqueur par glisser-déposer
            this.modifyInteraction = new Modify({
                source: this.vectorLayer?.getSource(),
            });

            this.map?.addInteraction(this.modifyInteraction);

            this.map?.on('singleclick', (evt) => {
                const coord = fromOlCoordinate(evt.coordinate);
                this.moveMarkerTo(coord.lat, coord.lng);
            });

            this.modifyInteraction.on('modifyend', () => {
                const geom = this.markerFeature?.getGeometry();
                if (geom) {
                    const coord = geom.getCoordinates();
                    const { lat, lng } = fromOlCoordinate(
                        coord as [number, number]
                    );
                    this.moveMarkerTo(lat, lng);
                }
            });
        });
    }

    private moveMarkerTo(lat: number, lng: number): void {
        if (!isValidCoordinates(lat, lng)) {
            console.warn(
                '[OlMap] Tentative de déplacement vers coordonnées invalides:',
                { lat, lng }
            );
            return;
        }

        const olCoord = toOlCoordinate(lat, lng);
        this.markerFeature?.getGeometry()?.setCoordinates(olCoord);

        // Mise à jour du service d'état (exécuté dans Angular zone)
        this.ngZone.run(() => {
            this.locationState.setSelected({
                latitude: lat,
                longitude: lng,
            } as Coordinates);
        });
    }

    ngOnDestroy(): void {
        if (this.map) {
            this.map.dispose();
            this.map = null;
        }

        this.markerFeature = null;
        this.vectorLayer.dispose();
        this.modifyInteraction = null;
    }
}
