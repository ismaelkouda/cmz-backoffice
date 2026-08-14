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

type RelayPointKey = 'A' | 'B';

export interface RelayPointCoordinates {
    latitude: number | null;
    longitude: number | null;
}

export interface RelayPointChange {
    point: RelayPointKey;
    latitude: number;
    longitude: number;
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
    selector: 'app-radio-relay-links-map-picker',
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
    templateUrl: './radio-relay-links-map-picker.component.html',
    styleUrls: ['./radio-relay-links-map-picker.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioRelayLinksMapPickerComponent implements OnDestroy {
    readonly pointA = input<RelayPointCoordinates | null>(null);
    readonly pointB = input<RelayPointCoordinates | null>(null);
    readonly height = input('450px');
    readonly pointChange = output<RelayPointChange>();

    private readonly platformId = inject(PLATFORM_ID);
    private readonly olLoader = inject(OpenLayersLoaderService);
    private readonly ngZone = inject(NgZone);
    private readonly geoService = inject(GEO_SERVICE);
    private readonly mapContainer =
        viewChild.required<ElementRef<HTMLDivElement>>('mapContainer');

    readonly activePoint = signal<RelayPointKey>('A');
    readonly searchQuery = signal('');
    readonly searchResults = signal<GeoLocation[]>([]);
    readonly isSearching = signal(false);
    readonly error = signal<string | null>(null);

    private readonly search$ = new Subject<string>();
    private readonly destroy$ = new Subject<void>();
    private map: any = null;
    private vectorSource: any = null;
    private vectorLayer: any = null;
    private lineSource: any = null;
    private lineLayer: any = null;
    private modifyInteraction: any = null;
    private olModules: any = null;
    private lineStringCtor: any = null;
    private readonly pointFeatures = new Map<RelayPointKey, any>();
    private lineFeature: any = null;
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
            this.pointA();
            this.pointB();
            this.syncFromInputs();
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

    setActivePoint(point: RelayPointKey): void {
        this.activePoint.set(point);
    }

    onSearchQueryChange(query: string): void {
        this.searchQuery.set(query);
        const coords = parseCoordinates(query);
        if (coords) {
            this.error.set(null);
            this.searchResults.set([]);
            this.setPointFromLatLng(
                this.activePoint(),
                coords.latitude,
                coords.longitude,
                true
            );
            return;
        }
        this.search$.next(query);
    }

    selectSearchResult(location: GeoLocation): void {
        this.searchQuery.set(location.displayName);
        this.searchResults.set([]);
        this.setPointFromLatLng(
            this.activePoint(),
            Number(location.lat),
            Number(location.lng),
            true
        );
    }

    private async initializeMap(container: HTMLElement): Promise<void> {
        this.olModules = await this.olLoader.loadModulesPromise();
        const lineStringModule = await import('ol/geom/LineString');
        this.lineStringCtor = lineStringModule.default;

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
        this.lineSource = new VectorSource();
        this.lineLayer = new VectorLayer({
            source: this.lineSource,
            style: (feature: any) => feature.get('style'),
        });
        this.vectorLayer = new VectorLayer({
            source: this.vectorSource,
            style: (feature: any) => feature.get('style'),
        });

        this.map = new OlMap({
            target: container,
            layers: [
                new TileLayer({ source: new OSM() }),
                this.lineLayer,
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
        const point = this.activePoint();
        this.setPointFromLatLng(point, latitude, longitude, true);
        this.activePoint.set(point === 'A' ? 'B' : 'A');
    }

    private handleModifyEnd(event: any): void {
        for (const feature of event.features.getArray()) {
            const point = feature.get('point') as RelayPointKey | undefined;
            if (!point || feature.get('kind') !== 'point') {
                continue;
            }
            const coordinate = feature.getGeometry()?.getCoordinates();
            if (!coordinate) {
                continue;
            }
            const { latitude, longitude } = fromOlCoordinate(coordinate);
            this.emitPoint(point, latitude, longitude);
        }
    }

    private syncFromInputs(): void {
        if (!this.map || !this.olModules || !this.lineStringCtor) {
            return;
        }

        this.upsertPoint('A', this.pointA(), false);
        this.upsertPoint('B', this.pointB(), false);
        this.renderLine();
        this.fitKnownPointsOnce();
    }

    private upsertPoint(
        point: RelayPointKey,
        coords: RelayPointCoordinates | null,
        focus: boolean
    ): void {
        if (
            coords?.latitude === null ||
            coords?.latitude === undefined ||
            coords.longitude === null ||
            coords.longitude === undefined
        ) {
            this.removePoint(point);
            this.renderLine();
            return;
        }

        const lat = Number(coords?.latitude);
        const lng = Number(coords?.longitude);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
            this.removePoint(point);
            this.renderLine();
            return;
        }

        const coordinate = this.olModules.fromLonLat([lng, lat]);
        const existing = this.pointFeatures.get(point);
        if (existing) {
            existing.getGeometry()?.setCoordinates(coordinate);
        } else {
            this.createPoint(point, coordinate);
        }

        if (focus) {
            this.map.getView().animate({
                center: coordinate,
                zoom: 13,
                duration: 300,
            });
        }
        this.renderLine();
    }

    private createPoint(point: RelayPointKey, coordinate: Coordinate): void {
        const { Feature, Point } = this.olModules;
        const feature = new Feature({
            geometry: new Point(coordinate),
        });
        feature.set('kind', 'point');
        feature.set('point', point);
        feature.set('style', this.createPointStyle(point));
        this.vectorSource.addFeature(feature);
        this.pointFeatures.set(point, feature);
    }

    private removePoint(point: RelayPointKey): void {
        const feature = this.pointFeatures.get(point);
        if (!feature) {
            return;
        }
        this.vectorSource.removeFeature(feature);
        this.pointFeatures.delete(point);
    }

    private renderLine(): void {
        const featureA = this.pointFeatures.get('A');
        const featureB = this.pointFeatures.get('B');
        const coordinateA = featureA?.getGeometry()?.getCoordinates();
        const coordinateB = featureB?.getGeometry()?.getCoordinates();

        if (!coordinateA || !coordinateB) {
            if (this.lineFeature) {
                this.lineSource.removeFeature(this.lineFeature);
                this.lineFeature = null;
            }
            return;
        }

        if (!this.lineFeature) {
            const { Feature } = this.olModules;
            this.lineFeature = new Feature({
                geometry: new this.lineStringCtor([coordinateA, coordinateB]),
            });
            this.lineFeature.set('kind', 'line');
            this.lineFeature.set('style', this.createLineStyle());
            this.lineSource.addFeature(this.lineFeature);
            return;
        }

        this.lineFeature
            .getGeometry()
            ?.setCoordinates([coordinateA, coordinateB]);
    }

    private fitKnownPointsOnce(): void {
        if (this.hasInitialFit || !this.vectorSource) {
            return;
        }
        const points = [...this.pointFeatures.values()];
        if (!points.length) {
            return;
        }
        this.hasInitialFit = true;
        const extent = this.vectorSource.getExtent();
        if (extent?.every((value: number) => Number.isFinite(value))) {
            this.map.getView().fit(extent, {
                padding: [70, 70, 70, 70],
                maxZoom: points.length === 1 ? 13 : 15,
                duration: 300,
            });
        }
    }

    private setPointFromLatLng(
        point: RelayPointKey,
        latitude: number,
        longitude: number,
        emit: boolean
    ): void {
        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
            return;
        }
        this.upsertPoint(point, { latitude, longitude }, true);
        if (emit) {
            this.emitPoint(point, latitude, longitude);
        }
    }

    private emitPoint(
        point: RelayPointKey,
        latitude: number,
        longitude: number
    ): void {
        this.pointChange.emit({
            point,
            latitude: this.roundCoordinate(latitude),
            longitude: this.roundCoordinate(longitude),
        });
    }

    private createPointStyle(point: RelayPointKey): any {
        const { Style, Circle, Fill, Stroke, Text } = this.olModules;
        const color = point === 'A' ? '#2256a3' : '#f08224';
        return new Style({
            image: new Circle({
                radius: 9,
                fill: new Fill({ color }),
                stroke: new Stroke({ color: '#ffffff', width: 3 }),
            }),
            text: new Text({
                text: point,
                offsetY: -22,
                fill: new Fill({ color: '#0f172a' }),
                stroke: new Stroke({ color: '#ffffff', width: 4 }),
                font: '700 14px sans-serif',
            }),
        });
    }

    private createLineStyle(): any {
        const { Style, Stroke } = this.olModules;
        return new Style({
            stroke: new Stroke({
                color: '#e11d48',
                width: 3,
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
