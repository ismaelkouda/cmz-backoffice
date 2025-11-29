// map-management.component.ts
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Inject,
    Input,
    NgZone,
    OnDestroy,
    OnInit,
    PLATFORM_ID,
    signal,
} from '@angular/core';
import { Subject } from 'rxjs';
import { OpenLayersLoaderService } from './service/openlayers-loader.service';

export interface MapMarker {
    id: string;
    latitude: number;
    longitude: number;
    title?: string;
    description?: string;
    color?: string;
}

@Component({
    selector: 'app-map-management',
    templateUrl: './map-management.component.html',
    styleUrls: ['./map-management.component.scss'],
    imports: [CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapManagementComponent implements OnInit, OnDestroy {
    readonly isMapInitialized = signal(false);
    readonly isLoading = signal(true);
    readonly mapViewState = signal({
        latitude: 0,
        longitude: 0,
        zoom: 15,
    });
    readonly selectedMarker = signal<MapMarker | null>(null);
    readonly showPopup = signal(false);

    // Inputs avec valeurs par défaut
    @Input() latitude!: number;
    @Input() longitude!: number;
    @Input() zoom: number = 15;
    @Input() markerTitle: string = 'Position';
    @Input() markerDescription: string = 'Localisation spécifiée';
    @Input() markerColor: string = '#3366ff';
    @Input() enablePopup: boolean = true;
    @Input() enableAnimations: boolean = true;

    private map: any = null;
    private markerLayer: any = null;
    private popupOverlay: any = null;
    private destroy$ = new Subject<void>();
    private olModules: any = null;

    constructor(
        private elementRef: ElementRef,
        private ngZone: NgZone,
        private openLayersLoader: OpenLayersLoaderService,
        @Inject(PLATFORM_ID) private platformId: object
    ) {}

    async ngOnInit() {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
        await this.initializeMap();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.cleanupMap();
    }

    private async initializeMap(): Promise<void> {
        try {
            this.isLoading.set(true);
            this.olModules = await this.openLayersLoader.loadModulesPromise();

            if (!this.olModules) {
                throw new Error('Modules OpenLayers non chargés');
            }

            await this.ngZone.runOutsideAngular(() => {
                this.createMap();
                this.addMarker();
                this.setupPopup();
                this.setupMapEvents();
            });

            this.isMapInitialized.set(true);
            this.isLoading.set(false);

            console.log('✅ Carte initialisée avec succès');
        } catch (error) {
            console.error("❌ Échec de l'initialisation de la carte:", error);
            this.isLoading.set(false);
            this.isMapInitialized.set(false);
        }
    }

    private createMap(): void {
        const { Map, View, fromLonLat, TileLayer, OSM } = this.olModules;

        const mapContainer =
            this.elementRef.nativeElement.querySelector('.map-container');
        if (!mapContainer) {
            throw new Error('Container de carte non trouvé');
        }

        // Créer la couche OSM
        const osmLayer = new TileLayer({
            source: new OSM({
                attributions: [
                    '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributeurs',
                ],
            }),
        });

        // Créer la carte
        this.map = new Map({
            target: mapContainer,
            layers: [osmLayer],
            view: new View({
                center: fromLonLat([this.longitude, this.latitude]),
                zoom: this.zoom,
                minZoom: 2,
                maxZoom: 18,
            }),
        });

        console.log(
            '🗺️ Carte créée avec centre:',
            this.latitude,
            this.longitude
        );
    }

    private addMarker(): void {
        const { Feature, Point, VectorLayer, VectorSource, Style, Icon } =
            this.olModules;

        // Créer le marqueur
        const marker = new Feature({
            geometry: new Point(
                this.olModules.fromLonLat([this.longitude, this.latitude])
            ),
            title: this.markerTitle,
            description: this.markerDescription,
        });

        // Style du marqueur avec SVG personnalisé
        marker.setStyle(
            new Style({
                image: new Icon({
                    src: this.generateMarkerSvg(this.markerColor),
                    scale: 0.8,
                    anchor: [0.5, 1],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'fraction',
                }),
            })
        );

        // Ajouter le marqueur à la carte
        const source = new VectorSource({ features: [marker] });
        this.markerLayer = new VectorLayer({ source });
        this.map.addLayer(this.markerLayer);

        console.log(
            '📍 Marqueur ajouté aux coordonnées:',
            this.latitude,
            this.longitude
        );
    }

    private generateMarkerSvg(color: string): string {
        const svg = `
            <svg width="40" height="50" viewBox="0 0 40 50" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 0C9 0 0 9 0 20C0 36 20 50 20 50S40 36 40 20C40 9 31 0 20 0Z" 
                      fill="${color}" stroke="#ffffff" stroke-width="2"/>
                <circle cx="20" cy="18" r="8" fill="#ffffff"/>
                <circle cx="20" cy="18" r="4" fill="${color}"/>
            </svg>
        `;
        return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    }

    private setupPopup(): void {
        const { Overlay } = this.olModules;

        const popupElement =
            this.elementRef.nativeElement.querySelector('.map-popup');
        this.popupOverlay = new Overlay({
            element: popupElement,
            positioning: 'bottom-center',
            stopEvent: false,
            offset: [0, -45],
        });

        this.map.addOverlay(this.popupOverlay);
    }

    private setupMapEvents(): void {
        // Clic sur le marqueur pour ouvrir le popup
        this.map.on('click', (evt: any) => {
            const feature = this.map.forEachFeatureAtPixel(
                evt.pixel,
                (ft: any) => ft
            );

            if (feature && this.enablePopup) {
                const coordinates = feature.getGeometry().getCoordinates();
                this.popupOverlay.setPosition(coordinates);

                this.selectedMarker.set({
                    id: 'main-marker',
                    latitude: this.latitude,
                    longitude: this.longitude,
                    title: feature.get('title'),
                    description: feature.get('description'),
                    color: this.markerColor,
                });

                this.showPopup.set(true);
            } else {
                this.showPopup.set(false);
            }
        });

        // Changement de vue
        this.map.getView().on('change', () => {
            const center = this.map.getView().getCenter();
            if (center) {
                const [longitude, latitude] = this.olModules.toLonLat(center);
                this.mapViewState.update((state) => ({
                    ...state,
                    latitude,
                    longitude,
                }));
            }
        });
    }

    // Méthodes publiques
    public recenterMap(): void {
        if (this.map && this.olModules) {
            const { fromLonLat } = this.olModules;
            this.map.getView().animate({
                center: fromLonLat([this.longitude, this.latitude]),
                zoom: this.zoom,
                duration: 1000,
            });
        }
    }

    private cleanupMap(): void {
        if (this.map) {
            this.map.setTarget(undefined);
            this.map.dispose();
        }
    }
}
