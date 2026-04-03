import { Injectable, NgZone } from '@angular/core';
import {
    MapCluster,
    Bounds,
} from '@pages/interactive-map/presentation/store/map.store';
import { Extent } from 'ol/extent';
import Feature from 'ol/Feature';
import { FeatureLike } from 'ol/Feature'; // Import FeatureLike type
import Point from 'ol/geom/Point';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import Map from 'ol/Map';
import { fromLonLat, transformExtent } from 'ol/proj';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import { Style, Circle as CircleStyle, Fill, Stroke, Text } from 'ol/style';
import View from 'ol/View';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

export interface MapOptions {
    zoom?: number;
    center?: { lat: number; lng: number };
    minZoom?: number;
    maxZoom?: number;
}

@Injectable({
    providedIn: 'root',
})
export class MapAdapter {
    private map: Map | null = null;
    private lastBounds: Bounds | null = null;
    private readonly vectorSource = new VectorSource();
    private vectorLayer = new VectorLayer({
        source: this.vectorSource,
    });
    private readonly moveEndSubject = new Subject<Bounds>();

    private readonly defaultOptions: Required<MapOptions> = {
        zoom: 12,
        center: { lat: 5.36, lng: -4.01 },
        minZoom: 3,
        maxZoom: 18,
    };

    // Fix: Change parameter type from Feature to FeatureLike
    private readonly clusterStyleFunction = (feature: FeatureLike): Style => {
        const count = feature.get('count') || 1;
        const isCluster = feature.get('isCluster') || false;
        return this.createClusterStyle(count, isCluster);
    };

    constructor(private readonly ngZone: NgZone) {}

    init(container: HTMLElement, options?: MapOptions): void {
        if (this.map) {
            console.warn('Map already initialized');
            return;
        }

        const mergedOptions = { ...this.defaultOptions, ...options };

        const tileLayer = new TileLayer({
            source: new OSM(),
        });

        this.vectorLayer = new VectorLayer({
            source: this.vectorSource,
            style: this.clusterStyleFunction,
        });

        this.map = new Map({
            target: container,
            layers: [tileLayer, this.vectorLayer],
            view: new View({
                center: fromLonLat([
                    mergedOptions.center.lng,
                    mergedOptions.center.lat,
                ]),
                zoom: mergedOptions.zoom,
                minZoom: mergedOptions.minZoom,
                maxZoom: mergedOptions.maxZoom,
            }),
        });
        this.renderClusters([]);
        this.setupMoveEndListener();
    }

    private setupMoveEndListener(): void {
        if (!this.map) {
            return;
        }

        this.map.on('moveend', () => {
            this.ngZone.run(() => {
                const bounds = this.getBounds();
                if (bounds && !this.areBoundsEqual(this.lastBounds, bounds)) {
                    this.lastBounds = bounds;
                    this.moveEndSubject.next(bounds);
                }
            });
        });
    }

    onMoveEnd(): Observable<Bounds> {
        return this.moveEndSubject
            .asObservable()
            .pipe(
                distinctUntilChanged((prev, curr) =>
                    this.areBoundsEqual(prev, curr)
                )
            );
    }

    setCenter(lat: number, lng: number, preserveZoom = true): void {
        if (!this.map) {
            console.warn('Map not initialized');
            return;
        }

        const view = this.map.getView();
        view.setCenter(fromLonLat([lng, lat]));

        if (!preserveZoom) {
            view.setZoom(12);
        }
    }

    getBounds(): Bounds | null {
        if (!this.map) {
            console.warn('Map not initialized');
            return null;
        }

        const view = this.map.getView();
        const size = this.map.getSize();
        if (!size) {
            return null;
        }

        const extent = view.calculateExtent(size);
        return this.extentToBounds(extent);
    }

    private extentToBounds(extent: Extent): Bounds {
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

    renderClusters(clusters: MapCluster[]): void {
        if (!this.vectorLayer || !this.map) {
            console.warn('Map not initialized');
            return;
        }

        this.vectorSource.clear();

        const features = clusters.map((cluster) => {
            const point = new Point(
                fromLonLat([cluster.longitude, cluster.latitude])
            );
            const feature = new Feature(point);
            feature.set('count', cluster.count);
            feature.set('isCluster', cluster.count > 1);
            return feature;
        });

        this.vectorSource.addFeatures(features);
    }

    private createClusterStyle(count: number, isCluster: boolean): Style {
        const radius = isCluster
            ? Math.min(15 + Math.floor(count / 10), 30)
            : 8;
        const color = isCluster ? '#FF6B6B' : '#4ECDC4';

        return new Style({
            image: new CircleStyle({
                radius: radius,
                fill: new Fill({ color }),
                stroke: new Stroke({
                    color: '#FFFFFF',
                    width: 2,
                }),
            }),
            text: isCluster
                ? new Text({
                      text: count.toString(),
                      fill: new Fill({ color: '#FFFFFF' }),
                      font: 'bold 12px sans-serif',
                      offsetY: -radius - 2,
                  })
                : undefined,
        });
    }

    public clearClusters(): void {
        if (!this.vectorLayer) {
            return;
        }
        this.vectorSource.clear();
    }

    public setZoom(zoom: number): void {
        if (!this.map) {
            console.warn('Map not initialized');
            return;
        }

        const view = this.map.getView();
        view.setZoom(zoom);
    }

    fitBounds(bounds: Bounds, options?: { padding?: number[] }): void {
        if (!this.map) {
            console.warn('Map not initialized');
            return;
        }

        const extent = this.boundsToExtent(bounds);
        this.map.getView().fit(extent, {
            padding: options?.padding || [50, 50, 50, 50],
            duration: 500,
        });
    }

    getZoom(): number | undefined | null {
        if (!this.map) {
            return null;
        }
        return this.map.getView().getZoom();
    }

    centerOnUser(lat: number, lng: number, zoom?: number): void {
        if (!this.map) {
            return;
        }

        const view = this.map.getView();
        const currentZoom = zoom || view.getZoom() || this.defaultOptions.zoom;

        view.animate({
            center: fromLonLat([lng, lat]),
            zoom: currentZoom,
            duration: 500,
        });
    }

    private boundsToExtent(bounds: Bounds): Extent {
        const geographicExtent: Extent = [
            bounds.minLng,
            bounds.minLat,
            bounds.maxLng,
            bounds.maxLat,
        ];

        return transformExtent(geographicExtent, 'EPSG:4326', 'EPSG:3857');
    }

    private areBoundsEqual(
        bounds1: Bounds | null,
        bounds2: Bounds | null
    ): boolean {
        if (!bounds1 || !bounds2) {
            return false;
        }
        return (
            bounds1.minLat === bounds2.minLat &&
            bounds1.maxLat === bounds2.maxLat &&
            bounds1.minLng === bounds2.minLng &&
            bounds1.maxLng === bounds2.maxLng
        );
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
    }
}
