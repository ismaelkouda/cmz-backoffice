// openlayers-loader.service.ts
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
}

@Injectable({
    providedIn: 'root',
})
export class OpenLayersLoaderService {
    private modules$: Observable<OpenLayersModules> | null = null;

    constructor(private ngZone: NgZone) {}

    /**
     * Charge les modules OpenLayers de manière lazy avec cache
     */
    loadModules(): Observable<OpenLayersModules> {
        if (!this.modules$) {
            this.modules$ = from(this.loadOpenLayersModules()).pipe(
                shareReplay(1),
                catchError((error) => {
                    this.modules$ = null;
                    throw new Error(
                        `Échec du chargement d'OpenLayers: ${error.message}`
                    );
                })
            );
        }
        return this.modules$;
    }

    /**
     * Charge tous les modules OpenLayers nécessaires - version moderne sans toPromise()
     */
    loadModulesPromise(): Promise<OpenLayersModules> {
        return this.loadModules()
            .pipe(take(1))
            .toPromise() as Promise<OpenLayersModules>;
    }

    private async loadOpenLayersModules(): Promise<OpenLayersModules> {
        return this.ngZone.runOutsideAngular(async () => {
            try {
                const [
                    mapModule,
                    viewModule,
                    tileLayerModule,
                    osmModule,
                    projModule,
                    geolocationModule,
                    featureModule,
                    pointModule,
                    vectorLayerModule,
                    vectorSourceModule,
                    styleModule,
                    circleModule,
                    fillModule,
                    strokeModule,
                    controlModule,
                ] = await Promise.all([
                    import('ol/Map'),
                    import('ol/View'),
                    import('ol/layer/Tile'),
                    import('ol/source/OSM'),
                    import('ol/proj'),
                    import('ol/Geolocation'),
                    import('ol/Feature'),
                    import('ol/geom/Point'),
                    import('ol/layer/Vector'),
                    import('ol/source/Vector'),
                    import('ol/style/Style'),
                    import('ol/style/Circle'),
                    import('ol/style/Fill'),
                    import('ol/style/Stroke'),
                    import('ol/control'),
                ]);

                return {
                    Map: mapModule.default,
                    View: viewModule.default,
                    TileLayer: tileLayerModule.default,
                    OSM: osmModule.default,
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
                };
            } catch (error) {
                console.error(
                    'Erreur lors du chargement des modules OpenLayers:',
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
