import { CommonModule } from '@angular/common';
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
import {
    OpenLayersLoaderService,
    OpenLayersModules,
} from '@shared/domain/services/openlayers-loader.service';
import type { Map } from 'ol';
import type Feature from 'ol/Feature';
import type { Point } from 'ol/geom';
import type { Modify } from 'ol/interaction';

import { LocationCoordinates } from '../models/location-coordinates.model';
import { isValidCoordinates } from '../utils/coordinates.utils';
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
            if (container && !this.map) {
                this.initMap(container.nativeElement);
            }
        });

        effect(() => {
            const coords = this.initialCoords();
            if (coords && this.map && this.markerFeature) {
                const olCoord = toOlCoordinate(coords.lat, coords.lng);
                this.markerFeature.getGeometry()?.setCoordinates(olCoord);
                this.map.getView().setCenter(olCoord);
            }
        });
    }

    private async initMap(container: HTMLElement): Promise<void> {
        this.olModules = await this.olLoader.loadModulesPromise();
        await this.ngZone.runOutsideAngular(async () => {
            await this.createMap(container);
        });
    }

    private async createMap(container: HTMLElement): Promise<void> {
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
        const osmLayer = new TileLayer({ source: new OSM() });

        this.map = new Map({
            target: container,
            layers: [osmLayer],
            view: new View({
                center: toOlCoordinate(5.3167, -4.0333),
                zoom: this.initialZoom(),
                minZoom: 2,
                maxZoom: 18,
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

        await this.createMarker();

        this.modifyInteraction = new Modify({
            source: this.vectorLayer.getSource(),
        });
        this.map.addInteraction(this.modifyInteraction);

        this.map.on('singleclick', (evt: any) => this.handleMapClick(evt));
        this.modifyInteraction.on('modifyend', () => this.handleDragEnd());
    }

    private async createMarker(): Promise<void> {
        if (!this.map || !this.vectorLayer) {
            return;
        }
        const { Feature, Point, Icon, Style } = this.olModules;

        const markerStyle = new Style({
            image: new Icon({
                src: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
                scale: 0.08,
                anchor: [0.5, 1],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
            }),
        });

        const initialCoord = toOlCoordinate(5.3167, -4.0333);

        this.markerFeature = new Feature({
            geometry: new Point(initialCoord),
        }) as Feature<Point>;
        this.markerFeature.setStyle(markerStyle);
        this.vectorLayer.getSource()?.addFeature(this.markerFeature);
    }

    private handleMapClick(evt: any): void {
        const { lat, lng } = fromOlCoordinate(evt.coordinate);
        this.emitCoordinates(lat, lng);
    }

    private handleDragEnd(): void {
        if (!this.markerFeature) {
            return;
        }
        const coord = this.markerFeature.getGeometry()?.getCoordinates();
        if (!coord) {
            return;
        }
        const { lat, lng } = fromOlCoordinate(coord as [number, number]);
        this.emitCoordinates(lat, lng);
    }

    // private moveMarkerTo(lat: number, lng: number): void {
    //     const olCoord = toOlCoordinate(lat, lng);
    //     this.markerFeature?.getGeometry()?.setCoordinates(olCoord);
    // }

    private emitCoordinates(lat: number, lng: number): void {
        if (!isValidCoordinates(lat, lng)) {
            console.warn(
                '[OlMap] Tentative de déplacement vers coordonnées invalides:',
                { lat, lng }
            );
            return;
        }
        this.coordinatesChange.emit({
            lat,
            lng,
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
