import { Injectable, NgZone } from '@angular/core';
import { Observable, from } from 'rxjs';
import { catchError, shareReplay, take } from 'rxjs/operators';

export interface OpenLayersModules {
    Map: typeof import('ol/Map').default;
    View: typeof import('ol/View').default;
    TileLayer: typeof import('ol/layer/Tile').default;
    OSM: typeof import('ol/source/OSM').default;
    fromLonLat: typeof import('ol/proj').fromLonLat;
    toLonLat: typeof import('ol/proj').toLonLat;
    Geolocation: typeof import('ol/Geolocation').default;
    Feature: typeof import('ol/Feature').default;
    Point: typeof import('ol/geom/Point').default;
    VectorLayer: typeof import('ol/layer/Vector').default;
    VectorSource: typeof import('ol/source/Vector').default;
    Style: typeof import('ol/style/Style').default;
    Circle: typeof import('ol/style/Circle').default;
    Fill: typeof import('ol/style/Fill').default;
    Stroke: typeof import('ol/style/Stroke').default;
    defaults: typeof import('ol/control').defaults;
    Overlay: typeof import('ol/Overlay').default;
    Icon: typeof import('ol/style/Icon').default;
}

@Injectable({
    providedIn: 'root',
})
export class OpenLayersLoaderService {
    private modules$: Observable<OpenLayersModules> | null = null;

    constructor(private ngZone: NgZone) {}

    loadModules(): Observable<OpenLayersModules> {
        if (!this.modules$) {
            this.modules$ = from(this.loadOpenLayersModules()).pipe(
                shareReplay(1),
                catchError((error) => {
                    console.error('Erreur chargement OpenLayers:', error);
                    this.modules$ = null;
                    throw new Error(
                        `Échec du chargement d'OpenLayers: ${error.message}`
                    );
                })
            );
        }
        return this.modules$;
    }

    async loadModulesPromise(): Promise<OpenLayersModules> {
        return this.loadModules()
            .pipe(take(1))
            .toPromise()
            .then((modules) => {
                if (!modules) {
                    throw new Error('Modules OpenLayers non chargés');
                }
                return modules;
            });
    }

    private async loadOpenLayersModules(): Promise<OpenLayersModules> {
        return this.ngZone.runOutsideAngular(async () => {
            try {
                const mapModule = await import('ol/Map');
                const viewModule = await import('ol/View');
                const tileLayerModule = await import('ol/layer/Tile');
                const osmSourceModule = await import('ol/source/OSM');
                const projModule = await import('ol/proj');
                const geolocationModule = await import('ol/Geolocation');
                const featureModule = await import('ol/Feature');
                const pointModule = await import('ol/geom/Point');
                const vectorLayerModule = await import('ol/layer/Vector');
                const vectorSourceModule = await import('ol/source/Vector');
                const styleModule = await import('ol/style/Style');
                const circleModule = await import('ol/style/Circle');
                const fillModule = await import('ol/style/Fill');
                const strokeModule = await import('ol/style/Stroke');
                const controlModule = await import('ol/control');
                const overlayModule = await import('ol/Overlay');
                const iconModule = await import('ol/style/Icon');

                return {
                    Map: mapModule.default,
                    View: viewModule.default,
                    TileLayer: tileLayerModule.default,
                    OSM: osmSourceModule.default,
                    fromLonLat: projModule.fromLonLat,
                    toLonLat: projModule.toLonLat,
                    Geolocation: geolocationModule.default,
                    Feature: featureModule.default,
                    Point: pointModule.default,
                    VectorLayer: vectorLayerModule.default,
                    VectorSource: vectorSourceModule.default,
                    Style: styleModule.default,
                    Circle: circleModule.default,
                    Fill: fillModule.default,
                    Stroke: strokeModule.default,
                    defaults: controlModule.defaults,
                    Overlay: overlayModule.default,
                    Icon: iconModule.default,
                };
            } catch (error) {
                console.error(
                    '❌ Erreur lors du chargement des modules OpenLayers:',
                    error
                );
                throw error;
            }
        });
    }

    isLoaded(): boolean {
        return this.modules$ !== null;
    }

    reload(): void {
        this.modules$ = null;
    }
}
// import { Injectable, NgZone } from '@angular/core';
// import {
//     MapCluster,
//     Bounds,
// } from '@pages/interactive-map/presentation/store/map.store';
// import { Extent } from 'ol/extent';
// import Feature from 'ol/Feature';
// import Point from 'ol/geom/Point';
// import TileLayer from 'ol/layer/Tile';
// import VectorLayer from 'ol/layer/Vector';
// import Map from 'ol/Map';
// import { fromLonLat, transformExtent } from 'ol/proj';
// import OSM from 'ol/source/OSM';
// import VectorSource from 'ol/source/Vector';
// import { Style, Circle as CircleStyle, Fill, Text } from 'ol/style';
// import View from 'ol/View';
// import { Observable, Subject } from 'rxjs';

// export interface MapOptions {
//     zoom?: number;
//     center?: { lat: number; lng: number };
//     minZoom?: number;
//     maxZoom?: number;
// }

// export interface MapClusterStyle {
//     color?: string;
//     radius?: number;
//     fontSize?: string;
// }

// @Injectable({
//     providedIn: 'root',
// })
// export class MapAdapter {
//     private map: Map | null = null;
//     private readonly vectorSource = new VectorSource();
//     private readonly vectorLayer = new VectorLayer({
//         source: this.vectorSource,
//     });
//     private readonly moveEndSubject = new Subject<Bounds>();

//     private readonly defaultOptions: Required<MapOptions> = {
//         zoom: 12,
//         center: { lat: 5.36, lng: -4.01 },
//         minZoom: 3,
//         maxZoom: 18,
//     };

//     constructor(private readonly ngZone: NgZone) {}

//     init(container: HTMLElement, options?: MapOptions): void {
//         if (this.map) {
//             console.warn('Map already initialized');
//             return;
//         }
//         const mergedOptions = { ...this.defaultOptions, ...options };

//         const tileLayer = new TileLayer({
//             source: new OSM(),
//         });

//         this.map = new Map({
//             target: container,
//             layers: [tileLayer, this.vectorLayer],
//             view: new View({
//                 center: fromLonLat([
//                     mergedOptions.center.lng,
//                     mergedOptions.center.lat,
//                 ]),
//                 zoom: mergedOptions.zoom,
//                 minZoom: mergedOptions.minZoom,
//                 maxZoom: mergedOptions.maxZoom,
//             }),
//         });

//         this.setupMoveEndListener();
//     }

//     private setupMoveEndListener(): void {
//         if (!this.map) {
//             return;
//         }

//         this.map.on('moveend', () => {
//             this.ngZone.run(() => {
//                 const bounds = this.getBounds();
//                 if (bounds) {
//                     this.moveEndSubject.next(bounds);
//                 }
//             });
//         });
//     }
//     onMoveEnd(): Observable<Bounds> {
//         return this.moveEndSubject.asObservable();
//     }

//     setCenter(lat: number, lng: number, zoom = 12): void {
//         if (!this.map) {
//             console.warn('Map not initialized');
//             return;
//         }

//         const view = this.map.getView();
//         view.setCenter(fromLonLat([lng, lat]));
//         view.setZoom(zoom);
//     }

//     getBounds(): Bounds | null {
//         if (!this.map) {
//             console.warn('Map not initialized');
//             return null;
//         }

//         const view = this.map.getView();
//         const size = this.map.getSize();
//         if (!size) {
//             return null;
//         }

//         const extent = view.calculateExtent(size);
//         return this.extentToBounds(extent);
//     }

//     private extentToBounds(extent: Extent): Bounds {
//         const geographicExtent = transformExtent(
//             extent,
//             'EPSG:3857',
//             'EPSG:4326'
//         );

//         return {
//             minLng: geographicExtent[0],
//             minLat: geographicExtent[1],
//             maxLng: geographicExtent[2],
//             maxLat: geographicExtent[3],
//         };
//     }

//     renderClusters(clusters: MapCluster[]): void {
//         if (!this.vectorLayer || !this.map) {
//             console.warn('Map not initialized');
//             return;
//         }

//         this.vectorSource.clear();

//         const features = clusters.map((cluster) => {
//             const point = new Point(
//                 fromLonLat([cluster.longitude, cluster.latitude])
//             );
//             const feature = new Feature(point);

//             feature.set('count', cluster.count);
//             feature.set('isCluster', cluster.count > 1);

//             return feature;
//         });

//         this.vectorSource.addFeatures(features);
//     }

//     clearClusters(): void {
//         if (!this.vectorLayer) {
//             return;
//         }
//         this.vectorSource.clear();
//     }

//     private createClusterStyle(count: number): Style {
//         return new Style({
//             image: new CircleStyle({
//                 radius: 15,
//                 fill: new Fill({
//                     color: '#1976d2',
//                 }),
//             }),
//             text: new Text({
//                 text: count.toString(),
//                 fill: new Fill({
//                     color: '#fff',
//                 }),
//             }),
//         });
//     }

//     setZoom(zoom: number): void {
//         if (!this.map) {
//             console.warn('Map not initialized');
//             return;
//         }

//         const view = this.map.getView();
//         view.setZoom(zoom);
//     }

//     fitBounds(bounds: Bounds, options?: { padding?: number[] }): void {
//         if (!this.map) {
//             console.warn('Map not initialized');
//             return;
//         }

//         const extent = this.boundsToExtent(bounds);
//         this.map.getView().fit(extent, {
//             padding: options?.padding || [50, 50, 50, 50],
//             duration: 500,
//         });
//     }

//     getZoom(): number | null {
//         if (!this.map) {
//             return null;
//         }

//         return this.map.getView().getZoom();
//     }

//     centerOnUser(lat: number, lng: number, zoom?: number): void {
//         if (!this.map) {
//             return;
//         }

//         const view = this.map.getView();
//         const currentZoom = zoom || view.getZoom() || this.defaultOptions.zoom;

//         view.animate({
//             center: fromLonLat([lng, lat]),
//             zoom: currentZoom,
//             duration: 500,
//         });
//     }

//     private boundsToExtent(bounds: Bounds): Extent {
//         const geographicExtent: Extent = [
//             bounds.minLng,
//             bounds.minLat,
//             bounds.maxLng,
//             bounds.maxLat,
//         ];

//         return transformExtent(geographicExtent, 'EPSG:4326', 'EPSG:3857');
//     }

//     private areBoundsEqual(bounds1: Bounds, bounds2: Bounds): boolean {
//         return (
//             bounds1.minLat === bounds2.minLat &&
//             bounds1.maxLat === bounds2.maxLat &&
//             bounds1.minLng === bounds2.minLng &&
//             bounds1.maxLng === bounds2.maxLng
//         );
//     }
// }
