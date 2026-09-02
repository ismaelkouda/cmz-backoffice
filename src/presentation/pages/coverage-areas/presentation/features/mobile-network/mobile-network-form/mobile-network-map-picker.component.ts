import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    NgZone,
    OnDestroy,
    PLATFORM_ID,
    effect,
    inject,
    input,
    output,
    signal,
    viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { OpenLayersLoaderService } from '@shared/domain/services/openlayers-loader.service';
import { parseCoordinates } from '@shared/components/location-picker/utils/coordinates.utils';
import { fromOlCoordinate } from '@shared/components/location-picker/utils/projection.utils';
import { GEO_SERVICE } from '@shared/components/location-picker/infrastructure/services/geo.service';
import { GeoProxyService } from '@shared/components/location-picker/infrastructure/services/geo-proxy.service';
import { GeoLocation } from '@shared/components/location-picker/domain/models/geo-location.model';
import { transformExtent } from 'ol/proj';
import { Coordinate } from 'ol/coordinate';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';

export interface MobileNetworkPointChange {
    longitude: number;
    latitude: number;
}

const IVORY_COAST_BOUNDS = {
    minLat: 4.223876,
    maxLat: 10.873696,
    minLng: -9.698757,
    maxLng: -1.656668,
};

const IVORY_COAST_CENTER = {
    latitude: (IVORY_COAST_BOUNDS.minLat + IVORY_COAST_BOUNDS.maxLat) / 2,
    longitude: (IVORY_COAST_BOUNDS.minLng + IVORY_COAST_BOUNDS.maxLng) / 2,
};

@Component({
    selector: 'app-mobile-network-map-picker',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        InputTextModule,
        InputGroupModule,
        InputGroupAddonModule,
    ],
    providers: [{ provide: GEO_SERVICE, useClass: GeoProxyService }],
    templateUrl: './mobile-network-map-picker.component.html',
    styleUrls: ['./mobile-network-map-picker.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileNetworkMapPickerComponent implements OnDestroy {
    readonly lng = input<number | null>(null);
    readonly lat = input<number | null>(null);
    readonly coverageRadius = input<number | null>(null);
    readonly height = input('450px');
    readonly pointChange = output<MobileNetworkPointChange>();

    private readonly platformId = inject(PLATFORM_ID);
    private readonly olLoader = inject(OpenLayersLoaderService);
    private readonly ngZone = inject(NgZone);
    private readonly geoService = inject(GEO_SERVICE);
    private readonly mapContainer =
        viewChild.required<ElementRef<HTMLDivElement>>('mapContainer');

    readonly searchQuery = signal('');
    readonly searchResults = signal<GeoLocation[]>([]);
    readonly isSearching = signal(false);
    readonly error = signal<string | null>(null);

    private readonly search$ = new Subject<string>();
    private readonly destroy$ = new Subject<void>();
    private map: any = null;
    private vectorSource: any = null;
    private vectorLayer: any = null;
    private circleSource: any = null;
    private circleLayer: any = null;
    private modifyInteraction: any = null;
    private olModules: any = null;
    private pointFeature: any = null;
    private circleFeature: any = null;
    private hasInitialFit = false;

    constructor() {
        this.search$
            .pipe(
                debounceTime(350),
                distinctUntilChanged(),
                takeUntil(this.destroy$)
            )
            .subscribe((query) => void this.searchLocation(query));

        effect(() => {
            const container = this.mapContainer();
            if (container && isPlatformBrowser(this.platformId) && !this.map) {
                void this.initializeMap(container.nativeElement);
            }
        });

        effect(() => {
            this.lng();
            this.lat();
            this.syncFromInputs();
        });

        effect(() => {
            const radius = this.coverageRadius();
            this.renderCircle(radius);
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        if (this.map) {
            this.map.dispose();
            this.map = null;
        }
    }

    onSearchQueryChange(query: string): void {
        this.searchQuery.set(query);
        const coords = parseCoordinates(query);
        if (coords) {
            this.error.set(null);
            this.searchResults.set([]);
            this.setPoint(coords.latitude, coords.longitude, true);
            return;
        }
        this.search$.next(query);
    }

    selectSearchResult(location: GeoLocation): void {
        this.searchQuery.set(location.displayName);
        this.searchResults.set([]);
        this.setPoint(Number(location.lat), Number(location.lng), true);
    }

    private async initializeMap(container: HTMLElement): Promise<void> {
        this.olModules = await this.olLoader.loadModulesPromise();

        await this.ngZone.runOutsideAngular(async () => {
            this.createMap(container);
        });
        this.syncFromInputs();
    }

    private createMap(container: HTMLElement): void {
        const {
            Map: OlMap,
            View,
            TileLayer,
            OSM,
            VectorLayer,
            VectorSource,
            Modify,
            Interactions,
            defaults,
            fromLonLat,
        } = this.olModules;

        this.vectorSource = new VectorSource();
        this.circleSource = new VectorSource();
        this.vectorLayer = new VectorLayer({
            source: this.vectorSource,
            style: (feature: any) => feature.get('style'),
        });
        this.circleLayer = new VectorLayer({
            source: this.circleSource,
            style: (feature: any) => feature.get('style'),
        });

        this.map = new OlMap({
            target: container,
            layers: [
                new TileLayer({ source: new OSM() }),
                this.circleLayer,
                this.vectorLayer,
            ],
            view: new View({
                center: fromLonLat([
                    IVORY_COAST_CENTER.longitude,
                    IVORY_COAST_CENTER.latitude,
                ]),
                zoom: 7,
                minZoom: 6,
                maxZoom: 19,
                extent: this.getIvoryCoastExtent(),
            }),
            controls: defaults({
                attribution: false,
                zoom: true,
            }),
            interactions: Interactions({
                mouseWheelZoom: true,
                dragPan: true,
            }),
        });

        this.modifyInteraction = new Modify({ source: this.vectorSource });
        this.map.addInteraction(this.modifyInteraction);
        this.map.on('singleclick', (event: any) =>
            this.handleMapClick(event.coordinate)
        );
        this.modifyInteraction.on('modifyend', (event: any) =>
            this.handleModifyEnd(event)
        );
        this.fitIvoryCoast();
    }

    private getIvoryCoastExtent(): number[] {
        return transformExtent(
            [
                IVORY_COAST_BOUNDS.minLng,
                IVORY_COAST_BOUNDS.minLat,
                IVORY_COAST_BOUNDS.maxLng,
                IVORY_COAST_BOUNDS.maxLat,
            ],
            'EPSG:4326',
            'EPSG:3857'
        );
    }

    private fitIvoryCoast(): void {
        this.map?.getView().fit(this.getIvoryCoastExtent(), {
            padding: [32, 32, 32, 32],
            maxZoom: 7,
            duration: 0,
        });
    }

    private handleMapClick(coordinate: Coordinate): void {
        const { latitude, longitude } = fromOlCoordinate(coordinate);
        this.setPoint(latitude, longitude, true);
    }

    private handleModifyEnd(event: any): void {
        for (const feature of event.features.getArray()) {
            if (feature.get('kind') !== 'point') {
                continue;
            }
            const coordinate = feature.getGeometry()?.getCoordinates();
            if (!coordinate) {
                continue;
            }
            const { latitude, longitude } = fromOlCoordinate(coordinate);
            this.emitPoint(latitude, longitude);
        }
    }

    private syncFromInputs(): void {
        if (!this.map || !this.olModules) {
            return;
        }

        const lng = this.lng();
        const lat = this.lat();
        if (
            lng !== null &&
            lng !== undefined &&
            lat !== null &&
            lat !== undefined
        ) {
            this.upsertPoint(lat, lng, false);
        } else {
            this.removePoint();
        }
        this.fitKnownPointOnce();
    }

    private renderCircle(radius: number | null): void {
        if (!this.circleSource || !this.olModules) {
            return;
        }

        if (this.circleFeature) {
            this.circleSource.removeFeature(this.circleFeature);
            this.circleFeature = null;
        }

        if (
            radius === null ||
            radius === undefined ||
            radius <= 0 ||
            !this.pointFeature
        ) {
            return;
        }

        const coordinate = this.pointFeature.getGeometry()?.getCoordinates();
        if (!coordinate) {
            return;
        }

        const { Feature, CircleGeom } = this.olModules;
        this.circleFeature = new Feature({
            geometry: new CircleGeom(coordinate, radius),
        });
        this.circleFeature.set('kind', 'circle');
        this.circleFeature.set('style', this.createCircleStyle());
        this.circleSource.addFeature(this.circleFeature);
    }

    private upsertPoint(lat: number, lng: number, focus: boolean): void {
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
            this.removePoint();
            return;
        }

        const coordinate = this.olModules.fromLonLat([lng, lat]);
        if (this.pointFeature) {
            this.pointFeature.getGeometry()?.setCoordinates(coordinate);
        } else {
            this.createPoint(coordinate);
        }

        this.renderCircle(this.coverageRadius());

        if (focus) {
            this.map.getView().animate({
                center: coordinate,
                zoom: 13,
                duration: 300,
            });
        }
    }

    private createPoint(coordinate: Coordinate): void {
        const { Feature, Point } = this.olModules;
        const feature = new Feature({
            geometry: new Point(coordinate),
        });
        feature.set('kind', 'point');
        feature.set('style', this.createPointStyle());
        this.vectorSource.addFeature(feature);
        this.pointFeature = feature;
    }

    private removePoint(): void {
        if (!this.pointFeature) {
            return;
        }
        this.vectorSource.removeFeature(this.pointFeature);
        this.pointFeature = null;
        if (this.circleFeature) {
            this.circleSource.removeFeature(this.circleFeature);
            this.circleFeature = null;
        }
    }

    private fitKnownPointOnce(): void {
        if (this.hasInitialFit || !this.vectorSource || !this.pointFeature) {
            return;
        }
        this.hasInitialFit = true;
        const coordinate = this.pointFeature.getGeometry()?.getCoordinates();
        if (coordinate) {
            this.map
                .getView()
                .fit(
                    [
                        coordinate[0] - 1000,
                        coordinate[1] - 1000,
                        coordinate[0] + 1000,
                        coordinate[1] + 1000,
                    ],
                    {
                        padding: [70, 70, 70, 70],
                        maxZoom: 13,
                        duration: 300,
                    }
                );
        }
    }

    private setPoint(latitude: number, longitude: number, emit: boolean): void {
        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
            return;
        }
        this.upsertPoint(latitude, longitude, true);
        if (emit) {
            this.emitPoint(latitude, longitude);
        }
    }

    private emitPoint(latitude: number, longitude: number): void {
        this.pointChange.emit({
            latitude: this.roundCoordinate(latitude),
            longitude: this.roundCoordinate(longitude),
        });
    }

    private createPointStyle(): any {
        const { Style, Circle, Fill, Stroke } = this.olModules;
        return new Style({
            image: new Circle({
                radius: 9,
                fill: new Fill({ color: '#2256a3' }),
                stroke: new Stroke({ color: '#ffffff', width: 3 }),
            }),
        });
    }

    private createCircleStyle(): any {
        const { Style, Fill, Stroke } = this.olModules;
        return new Style({
            fill: new Fill({ color: 'rgb(34, 86, 163, 0.12)' }),
            stroke: new Stroke({
                color: '#2256a3',
                width: 2,
                lineDash: [6, 4],
            }),
        });
    }

    private async searchLocation(query: string): Promise<void> {
        const trimmed = query.trim();
        if (trimmed.length < 3) {
            this.searchResults.set([]);
            this.error.set(null);
            return;
        }

        this.isSearching.set(true);
        this.error.set(null);
        try {
            this.searchResults.set(await this.geoService.geocode(trimmed));
        } catch {
            this.error.set('Recherche indisponible');
        } finally {
            this.isSearching.set(false);
        }
    }

    private roundCoordinate(value: number): number {
        return Math.round(value * 10_000_000) / 10_000_000;
    }
}
