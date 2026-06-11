import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    NgZone,
    OnDestroy,
    effect,
    inject,
    input,
    output,
    viewChild,
} from '@angular/core';
import { transformExtent } from 'ol/proj';
import {
    OpenLayersLoaderService,
    OpenLayersModules,
} from '@shared/domain/services/openlayers-loader.service';
import type { Map } from 'ol';
import { Coordinate } from 'ol/coordinate';
import type Feature from 'ol/Feature';
import type { Point } from 'ol/geom';
import type { Modify } from 'ol/interaction';

import { LocationCoordinates } from '../models/location-coordinates.model';
import {
    isValidCoordinates,
    normalizeCoordinates,
} from '../utils/coordinates.utils';
import { fromOlCoordinate, toOlCoordinate } from '../utils/projection.utils';
import { Bounds } from '@presentation/pages/interactive-map/domain/models/interactive-map-report.model';
const IVORY_COAST_BOUNDS: Bounds = {
    minLat: 4.223876, // Point le plus au sud (Latitude minimale)
    maxLat: 10.873696, // Point le plus au nord (Latitude maximale)
    minLng: -9.698757, // Point le plus à l'ouest (Longitude minimale)
    maxLng: -1.656668, // Point le plus à l'est (Longitude maximale)
};
@Component({
    selector: 'app-ol-map',
    standalone: true,
    templateUrl: `./ol-map.component.html`,
    styleUrls: ['./ol-map.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OlMapComponent implements OnDestroy {
    readonly initialCoords = input<LocationCoordinates | null>(null);
    readonly initialZoom = input<number>(15);

    readonly coordinatesChange = output<LocationCoordinates>();

    private readonly mapContainer =
        viewChild.required<ElementRef<HTMLDivElement>>('mapContainer');
    private readonly olLoader = inject(OpenLayersLoaderService);
    private readonly ngZone = inject(NgZone);

    private map: Map | null = null;
    private markerFeature: Feature<Point> | null = null;
    private vectorLayer!: any;
    private modifyInteraction: Modify | null = null;

    private olModules!: OpenLayersModules;

    constructor() {
        effect(() => {
            const container = this.mapContainer();
            const coords = this.initialCoords();

            if (container) {
                if (!this.map) {
                    // Si la carte n'existe pas encore, l'initialiser
                    // Si des coordonnées sont fournies, les utiliser, sinon utiliser le centre de la Côte d'Ivoire
                    const centerCoord =
                        coords &&
                        isValidCoordinates(coords.latitude, coords.longitude)
                            ? toOlCoordinate(coords.latitude, coords.longitude)
                            : toOlCoordinate(7.539989, -5.54708); // Centre approximatif de la Côte d'Ivoire

                    this.initMap(container.nativeElement, centerCoord);
                } else if (
                    coords &&
                    isValidCoordinates(coords.latitude, coords.longitude)
                ) {
                    // Si la carte existe et que des coordonnées valides sont fournies
                    this.moveMapToCoordinates(
                        coords.latitude,
                        coords.longitude
                    );
                } else if (
                    !coords ||
                    !isValidCoordinates(coords.latitude, coords.longitude)
                ) {
                    // Si la carte existe mais les coordonnées sont null/invalides, centrer sur la Côte d'Ivoire
                    const ivoryCoastCenter = toOlCoordinate(7.539989, -5.54708);
                    this.map.getView().animate({
                        center: ivoryCoastCenter,
                        duration: 500,
                        zoom: 6, // Un zoom plus large pour voir tout le pays
                    });
                    // Optionnel : déplacer ou masquer le marqueur
                    if (this.markerFeature) {
                        this.vectorLayer
                            .getSource()
                            ?.removeFeature(this.markerFeature);
                        this.markerFeature = null;
                    }
                }
            }
        });
    }

    private moveMapToCoordinates(lat: number, lng: number): void {
        if (!this.map) {
            return;
        }

        const olCoord = toOlCoordinate(lat, lng);

        this.moveMarkerTo(lat, lng);

        this.map.getView().animate({
            center: olCoord,
            duration: 500,
            zoom: this.initialZoom(),
        });
    }

    private async initMap(
        container: HTMLElement,
        olCoord: Coordinate
    ): Promise<void> {
        this.olModules = await this.olLoader.loadModulesPromise();
        await this.ngZone.runOutsideAngular(async () => {
            await this.createMap(container, olCoord);
        });
    }

    private async createMap(
        container: HTMLElement,
        olCoord: Coordinate
    ): Promise<void> {
        const {
            Map,
            View,
            TileLayer,
            OSM,
            Interactions,
            VectorLayer,
            VectorSource,
            Modify,
        } = this.olModules;
        const osmLayer = new TileLayer({
            source: new OSM({
                attributions: [
                    '© <a href="https://www.imako.digital" target="_blank">IMAKO</a>',
                ],
            }),
        });

        this.map = new Map({
            target: container,
            layers: [osmLayer],
            view: new View({
                center: olCoord ?? toOlCoordinate(5.3167, -4.0333),
                zoom: this.initialZoom(),
                minZoom: 2,
                maxZoom: 18,
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
            interactions: Interactions({
                mouseWheelZoom: true,
                dragPan: true,
            }),
        });

        this.vectorLayer = new VectorLayer({
            source: new VectorSource(),
        });
        this.map.addLayer(this.vectorLayer);
        this.map
            .getView()
            .setCenter(olCoord ?? toOlCoordinate(5.3167, -4.0333));

        await this.createMarker(olCoord);

        this.modifyInteraction = new Modify({
            source: this.vectorLayer.getSource(),
        });
        this.map.addInteraction(this.modifyInteraction);

        this.map.on('singleclick', (evt: any) => this.handleMapClick(evt));
        this.modifyInteraction.on('modifyend', () => this.handleDragEnd());
    }

    private async createMarker(olCoord: Coordinate): Promise<void> {
        if (!this.map || !this.vectorLayer) {
            return;
        }
        const { Feature, Point, Icon, Style, Circle, Fill, Stroke } =
            this.olModules;

        const markerStyle = new Style({
            image: new Icon({
                src: 'data/square.svg',
                scale: 0.08,
                anchor: [0.5, 1],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
            }),
        });

        const pointStyle = new Style({
            image: new Circle({
                radius: 7,
                fill: new Fill({
                    color: '#2256a3',
                }),
                stroke: new Stroke({
                    color: 'white',
                    width: 2,
                }),
            }),
        });

        this.markerFeature = new Feature({
            geometry: new Point(olCoord ?? toOlCoordinate(5.3167, -4.0333)),
        }) as Feature<Point>;
        this.markerFeature.setStyle([pointStyle, markerStyle]);
        this.vectorLayer.getSource()?.addFeature(this.markerFeature);
    }

    private handleMapClick(evt: any): void {
        this.syncPosition(evt.coordinate);
    }

    private syncPosition(coord: [number, number]): void {
        const { latitude, longitude } = fromOlCoordinate(coord);

        this.moveMarkerTo(latitude, longitude);
        this.emitCoordinates(latitude, longitude);

        this.map?.getView().animate({
            center: coord,
            duration: 300,
        });
    }

    private moveMarkerTo(lat: number, lng: number): void {
        if (!this.markerFeature) {
            return;
        }

        const olCoord = toOlCoordinate(lat, lng);

        this.markerFeature.getGeometry()?.setCoordinates(olCoord);
    }

    private handleDragEnd(): void {
        if (!this.markerFeature) {
            return;
        }
        const coord = this.markerFeature.getGeometry()?.getCoordinates();
        if (!coord) {
            return;
        }
        const { latitude, longitude } = fromOlCoordinate(
            coord as [number, number]
        );
        this.emitCoordinates(latitude, longitude);
    }

    // private moveMarkerTo(lat: number, lng: number): void {
    //     const olCoord = toOlCoordinate(lat, lng);
    //     this.markerFeature?.getGeometry()?.setCoordinates(olCoord);
    // }

    private emitCoordinates(latitude: number, longitude: number): void {
        if (!isValidCoordinates(latitude, longitude)) {
            console.warn(
                '[OlMap] Tentative de déplacement vers coordonnées invalides:',
                { latitude, longitude }
            );
            return;
        }
        const normalize = normalizeCoordinates(latitude, longitude);
        this.coordinatesChange.emit(normalize);
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
