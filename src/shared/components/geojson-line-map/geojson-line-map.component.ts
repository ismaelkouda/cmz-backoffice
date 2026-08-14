import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    effect,
    ElementRef,
    inject,
    input,
    NgZone,
    OnDestroy,
    PLATFORM_ID,
    signal,
    viewChild,
} from '@angular/core';
import { OpenLayersLoaderService } from '@shared/domain/services/openlayers-loader.service';
import { transformExtent } from 'ol/proj';
import { Subject } from 'rxjs';

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
    selector: 'app-geojson-line-map',
    standalone: true,
    templateUrl: './geojson-line-map.component.html',
    styleUrls: ['./geojson-line-map.component.scss'],
    imports: [CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeojsonLineMapComponent implements OnDestroy {
    private readonly platformId = inject(PLATFORM_ID);
    private readonly openLayersLoader = inject(OpenLayersLoaderService);
    private readonly ngZone = inject(NgZone);
    private readonly mapContainer =
        viewChild.required<ElementRef<HTMLDivElement>>('mapContainer');

    readonly geojson = input<object | string | null>(null);
    readonly height = input<string>('360px');
    readonly strokeColor = input<string>('#e11d48');
    readonly strokeWidth = input<number>(3);

    readonly isMapInitialized = signal(false);
    readonly isLoading = signal(true);
    readonly errorMessage = signal<string | null>(null);

    private map: any = null;
    private vectorLayer: any = null;
    private olModules: any = null;
    private geoJsonFormat: any = null;
    private readonly destroy$ = new Subject<void>();

    constructor() {
        effect(() => {
            const container = this.mapContainer();
            if (container && isPlatformBrowser(this.platformId) && !this.map) {
                void this.initializeMap(container.nativeElement);
            }
        });

        effect(() => {
            const data = this.geojson();
            if (this.map && this.olModules) {
                void this.renderGeoJson(data);
            }
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        if (this.map) {
            this.map.setTarget(undefined);
            this.map = null;
        }
    }

    private async initializeMap(container: HTMLElement): Promise<void> {
        try {
            this.isLoading.set(true);
            this.olModules = await this.openLayersLoader.loadModulesPromise();
            const geoJsonModule = await import('ol/format/GeoJSON');
            this.geoJsonFormat = new geoJsonModule.default();

            const { Map, View, TileLayer, OSM, defaults, fromLonLat } =
                this.olModules;

            this.ngZone.runOutsideAngular(() => {
                this.map = new Map({
                    target: container,
                    layers: [
                        new TileLayer({
                            source: new OSM(),
                        }),
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
                });
            });

            this.isMapInitialized.set(true);
            this.fitIvoryCoast();
            await this.renderGeoJson(this.geojson());
        } catch (error) {
            console.error(error);
            this.errorMessage.set('MAP_LOAD_ERROR');
        } finally {
            this.isLoading.set(false);
        }
    }

    private async resolveGeoJson(
        data: object | string | null
    ): Promise<object | null> {
        if (!data) {
            return null;
        }
        if (typeof data === 'object') {
            return data;
        }
        if (typeof data === 'string') {
            const trimmed = data.trim();
            if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
                return JSON.parse(trimmed);
            }
            const response = await fetch(trimmed);
            if (!response.ok) {
                throw new Error('GEOM_FETCH_FAILED');
            }
            return response.json();
        }
        return null;
    }

    private async renderGeoJson(data: object | string | null): Promise<void> {
        if (!this.map || !this.olModules || !this.geoJsonFormat) {
            return;
        }

        try {
            this.errorMessage.set(null);
            const geojson = await this.resolveGeoJson(data);
            const { VectorLayer, VectorSource, Style, Stroke } = this.olModules;

            if (this.vectorLayer) {
                this.map.removeLayer(this.vectorLayer);
                this.vectorLayer = null;
            }

            if (!geojson) {
                this.fitIvoryCoast();
                return;
            }

            const features = this.geoJsonFormat.readFeatures(geojson, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857',
            });

            const source = new VectorSource({ features });
            this.vectorLayer = new VectorLayer({
                source,
                style: new Style({
                    stroke: new Stroke({
                        color: this.strokeColor(),
                        width: this.strokeWidth(),
                    }),
                }),
            });

            this.map.addLayer(this.vectorLayer);

            const extent = source.getExtent();
            if (extent && extent.every((v: number) => Number.isFinite(v))) {
                if (
                    this.isEmptyExtent(extent) ||
                    !this.intersectsIvoryCoast(extent)
                ) {
                    this.fitIvoryCoast();
                    return;
                }
                this.map.getView().fit(extent, {
                    padding: [48, 48, 48, 48],
                    maxZoom: 16,
                    duration: 300,
                });
            }
        } catch (error) {
            console.error(error);
            this.errorMessage.set('GEOM_INVALID');
        }
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

    private isEmptyExtent(extent: number[]): boolean {
        return extent[0] === extent[2] && extent[1] === extent[3];
    }

    private intersectsIvoryCoast(extent: number[]): boolean {
        const ivoryCoastExtent = this.getIvoryCoastExtent();
        return !(
            extent[2] < ivoryCoastExtent[0] ||
            extent[0] > ivoryCoastExtent[2] ||
            extent[3] < ivoryCoastExtent[1] ||
            extent[1] > ivoryCoastExtent[3]
        );
    }

    private fitIvoryCoast(): void {
        this.map?.getView().fit(this.getIvoryCoastExtent(), {
            padding: [32, 32, 32, 32],
            maxZoom: 7,
            duration: 0,
        });
    }
}
