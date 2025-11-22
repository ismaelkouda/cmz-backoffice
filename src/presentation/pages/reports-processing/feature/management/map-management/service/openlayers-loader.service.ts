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
    Overlay: typeof import('ol/Overlay').default;
    Icon: typeof import('ol/style/Icon').default;
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

    /**
     * Version Promise pour une utilisation plus simple
     */
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
                console.log('🔄 Chargement des modules OpenLayers...');

                // Importations principales
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

                console.log('✅ Tous les modules OpenLayers chargés');

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
