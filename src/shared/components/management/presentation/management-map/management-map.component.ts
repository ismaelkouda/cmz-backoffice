import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    ElementRef,
    inject,
    input,
    NgZone,
    OnDestroy,
    OnInit,
    PLATFORM_ID,
    signal,
    viewChild,
} from '@angular/core';
import { ConfigurationService } from '@core/services/configuration.service';
import { Bounds } from '@presentation/pages/interactive-map/domain/models/interactive-map-report.model';
import { InteractiveMapReportsApi } from '@presentation/pages/interactive-map/infrastructure/data/sources/interactive-map-reports.api';
import {
    getReportTypeColor,
    getReportTypeIconPath,
    getReportTypeLabel,
} from '@shared/domain/constants/report-icon';
import {
    StateLabel as FinalizationState,
    StateStyle as FinalizationStateStyle,
} from '@pages/finalization/domain/enums/details/details-state/details-state.enum';
import {
    StateLabel as ProcessingState,
    StateStyle as ProcessingStateStyle,
} from '@pages/processing/domain/enums/details/details-state/details-state.enum';
import {
    StatusLabel,
    StatusStyle,
} from '@pages/requests/domain/enums/details/details-status/details-status.enum';
import { AuthToken } from '@shared/domain/interfaces/current-user.interface';
import { EncodingDataService } from '@shared/domain/services/encoding-data.service';
import { OpenLayersLoaderService } from '@shared/domain/services/openlayers-loader.service';
import { createAuthenticatedVectorTileLoader } from '@shared/domain/utils/authenticated-vector-tile-loader.util';
import { hexToRgba } from '@shared/domain/utils/hex-to-rgba.util';
import { InfrastructureImpactStatItem } from '@presentation/pages/interactive-map/domain/models/interactive-map-report.model';
import { transformExtent } from 'ol/proj';
import { SeparatorThousandsPipe } from '@shared/domain/pipes/separator-thousands.pipe';
import { Subject, takeUntil } from 'rxjs';
import { FilterOption } from '@shared/components/filter/filter.types';
import { TranslateModule } from '@ngx-translate/core';
import { TagModule } from 'primeng/tag';
import { operatorsTagStyle } from '@shared/domain/functions/operators-tag-style.function';

export interface MapMarker {
    id: string;
    latitude: number;
    longitude: number;
    title?: string;
    description?: string;
    color?: string;
}

const IVORY_COAST_BOUNDS: Bounds = {
    minLat: 4.223876,
    maxLat: 10.873696,
    minLng: -9.698757,
    maxLng: -1.656668,
};

/** Couleurs de secours du pin générique, selon `markerType`. */
const MARKER_TYPE_COLORS: Record<string, string> = {
    warning: '#f59e0b',
    danger: '#dc2626',
    info: '#2563eb',
    success: '#16a34a',
};

/** Couleurs des points d'équipements/infrastructures, par type. */
const EQUIPMENT_TYPE_COLORS: Record<string, string> = {
    education: '#1d4ed8',
    sante: '#dc2626',
    administration: '#7c3aed',
    securité: '#059669',
    autre: '#6b7280',
};

@Component({
    selector: 'app-management-map',
    templateUrl: './management-map.component.html',
    styleUrls: ['./management-map.component.scss'],
    imports: [CommonModule, SeparatorThousandsPipe, TranslateModule, TagModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagementMapComponent implements OnInit, OnDestroy {
    // Mêmes bornes que interactive-map's MapAdapter (REPORT_ICON_MIN_PX /
    // REPORT_ICON_MAX_PX / MAP_ICON_MIN_ZOOM / MAP_ICON_MAX_ZOOM) pour que
    // l'icône de signalement ait exactement la même taille sur les deux
    // cartes, à zoom équivalent.
    private static readonly REPORT_ICON_MIN_PX = 20;
    private static readonly REPORT_ICON_MAX_PX = 50;
    private static readonly MAP_ICON_MIN_ZOOM = 7;
    private static readonly MAP_ICON_MAX_ZOOM = 18;

    private readonly platformId = inject(PLATFORM_ID);

    private readonly openLayersLoader = inject(OpenLayersLoaderService);
    private readonly reportsApi = inject(InteractiveMapReportsApi);
    private readonly configurationService = inject(ConfigurationService);
    private readonly encodingService = inject(EncodingDataService);
    private readonly ngZone = inject(NgZone);
    private readonly elementRef = inject(ElementRef);
    private readonly mapContainer =
        viewChild.required<ElementRef<HTMLDivElement>>('mapContainer');
    /**
     * Ancre DOM dans laquelle les contrôles de zoom natifs d'OpenLayers
     * sont reparentés (voir createMap) : même technique que
     * interactive-map, pour garder une distance constante avec
     * `.right-panel-stack` peu importe son état déroulé/replié.
     */
    private readonly zoomControlsAnchor =
        viewChild<ElementRef<HTMLElement>>('zoomControlsAnchor');
    readonly isMapInitialized = signal(false);
    readonly isLoading = signal(true);
    readonly mapViewState = signal({
        latitude: 0,
        longitude: 0,
        zoom: 15,
    });
    readonly selectedMarker = signal<MapMarker | null>(null);
    readonly showPopup = signal(false);

    public readonly latitude = input.required<number>();
    public readonly longitude = input.required<number>();
    public readonly zoom = input<number>(15);
    public readonly markerTitle = input<string>('Position');
    public readonly markerDescription = input<string>('Localisation spécifiée');
    public readonly markerColor = input<string>('#3366ff');
    public readonly enablePopup = input<boolean>(true);
    public readonly enableAnimations = input<boolean>(true);
    /** Type visuel du pin générique (utilisé si aucune icône de signalement). */
    public readonly markerType = input<string>('default');
    /**
     * Affiche un badge indiquant le rayon d'impact configuré. Sert aussi de
     * levier pour activer d'éventuels indicateurs de performance additionnels.
     */
    public readonly showPerformance = input<boolean>(false);
    /** Type de signalement (zob/cpo/cps/abi ou clé de traduction COMMON.X). */
    public readonly reportType = input<string | undefined>(undefined);
    /**
     * Identifiant du signalement, requis pour charger les tuiles
     * d'infrastructures scopées à ce signalement (voir updateEquipmentLayer).
     */
    public readonly reportUniqId = input<string | undefined>(undefined);
    public readonly status = input<
        ProcessingState | FinalizationState | StatusLabel | undefined
    >(undefined);
    public readonly statusStyle = input<
        ProcessingStateStyle | FinalizationStateStyle | StatusStyle | undefined
    >(undefined);
    public readonly telecomOperatorsOptions = input<FilterOption[]>([]);
    public readonly createdAt = input<string | undefined>(undefined);
    public readonly initiatorPhone = input<string | undefined>(undefined);
    public readonly confirmCount = input<number | undefined>(undefined);
    /** Rayon d'impact affiché autour du signalement, en mètres réels. */
    public readonly radiusMeters = input<number>(1000);
    public readonly showRadiusCircle = input<boolean>(true);

    public readonly coverageLegendOpen = signal(true);
    public readonly currentBaseMap = signal<'osm' | 'satellite'>('osm');
    public readonly equipmentOptions: { id: string; label: string }[] = [
        { id: 'education', label: 'Education' },
        { id: 'sante', label: 'Santé' },
        { id: 'administration', label: 'Administration' },
        { id: 'securité', label: 'Sécurité' },
        { id: 'autre', label: 'Autre' },
    ];
    public readonly equipmentsVisible = signal<Record<string, boolean>>(
        Object.fromEntries(this.equipmentOptions.map((eq) => [eq.id, false]))
    );
    public readonly allEquipmentsVisible = computed(() => {
        const vis = this.equipmentsVisible();
        return Object.values(vis).every((v) => v === true);
    });

    /**
     * Nombre d'infrastructures impactées par tag normalisé (voir
     * `toInfrastructureTileTag`), issu de l'API
     * `impacts/infrastructures/{reportUniqId}/stats`. Consommé via
     * `getInfrastructureCount()` dans le panneau "Filtres sur les couches".
     */
    public readonly infrastructureCounts = signal<Record<string, number>>({});

    /** Libellé humain du type de signalement, affiché dans le panneau infos. */
    public readonly reportTypeLabel = computed(() =>
        getReportTypeLabel(this.reportType())
    );
    /** Couleur associée au type de signalement, réutilisée pour le badge du panneau infos. */
    public readonly reportTypeColor = computed(
        () => getReportTypeColor(this.reportType()) ?? '#2563eb'
    );
    public readonly signalementInfoOpen = signal(true);

    public toggleSignalementInfo(): void {
        this.signalementInfoOpen.update((v) => !v);
    }

    private map: any = null;
    private markerLayer: any = null;
    private radiusLayer: any = null;
    private osmLayer: any = null;
    private satelliteLayer: any = null;
    private readonly equipmentLayers = new globalThis.Map<string, any>();
    private popupOverlay: any = null;
    private readonly destroy$ = new Subject<void>();
    private olModules: any = null;

    constructor() {
        effect(() => {
            const container = this.mapContainer();
            if (container && !this.map) {
                this.initializeMap(container.nativeElement);
            }
        });

        effect(() => {
            const reportUniqId = this.reportUniqId();
            this.loadInfrastructureStats(reportUniqId);
        });
    }

    ngOnInit(): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.cleanupMap();
    }

    private async initializeMap(container: HTMLElement): Promise<void> {
        try {
            this.isLoading.set(true);
            this.olModules = await this.openLayersLoader.loadModulesPromise();

            if (!this.olModules) {
                throw new Error('Modules OpenLayers non chargés');
            }

            await this.ngZone.runOutsideAngular(() => {
                this.createMap(container);
                this.addMarker();
                this.addRadiusCircle();
                this.setupPopup();
                // this.setupMapEvents();
            });

            this.isMapInitialized.set(true);
            this.isLoading.set(false);
        } catch (error) {
            console.error("❌ Échec de l'initialisation de la carte:", error);
            this.isLoading.set(false);
            this.isMapInitialized.set(false);
        }
    }

    private createMap(container: HTMLElement): void {
        const {
            Map,
            View,
            fromLonLat,
            TileLayer,
            OSM,
            XYZ,
            defaults: defaultControls,
            Zoom,
        } = this.olModules;

        if (!this.mapContainer()) {
            throw new Error('Container de carte non trouvé');
        }

        this.osmLayer = new TileLayer({
            source: new OSM({
                attributions: [
                    '© <a href="https://ansut.ci" target="_blank">ANSUT</a>',
                ],
            }),
            visible: true,
            zIndex: 0,
        });

        this.satelliteLayer = new TileLayer({
            source: new XYZ({
                url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                maxZoom: 19,
                attributions: '...',
            }),
            visible: false,
            zIndex: 0,
        });

        // Reparente les contrôles +/- natifs d'OpenLayers dans
        // #zoomControlsAnchor (voir .map-side-controls dans le template) :
        // même technique que interactive-map's MapAdapter, pour que ces
        // contrôles gardent une distance constante avec `.right-panel-stack`
        // peu importe son état ouvert/replié, plutôt que d'être positionnés
        // en absolu par rapport à la carte.
        const zoomTarget = this.zoomControlsAnchor()?.nativeElement;
        const controls = zoomTarget
            ? defaultControls({ zoom: false }).extend([
                  new Zoom({ target: zoomTarget }),
              ])
            : defaultControls({ zoom: true });

        this.map = new Map({
            target: container,
            layers: [this.osmLayer, this.satelliteLayer],
            controls,
            view: new View({
                center: fromLonLat([this.longitude(), this.latitude()]),
                zoom: this.zoom(),
                // Empêche de dézoomer au-delà du niveau 9 (vue trop large
                // n'a pas de sens pour une carte de détail signalement).
                minZoom: 9,
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
        });
    }

    protected getOperatorTagStyle(operator: string): Record<string, string> {
        console.log('operator: ', operator);
        console.log(
            'telecomOperatorsOptions()',
            this.telecomOperatorsOptions()
        );
        return operatorsTagStyle(operator);
    }

    /**
     * Change le fond de carte (OpenStreetMap / Satellitaire), même
     * comportement que le panneau "Filtres sur les couches" d'interactive-map.
     * @param type
     */
    public setBaseMap(type: 'osm' | 'satellite'): void {
        this.currentBaseMap.set(type);
        if (!this.osmLayer || !this.satelliteLayer) {
            return;
        }
        this.osmLayer.setVisible(type === 'osm');
        this.satelliteLayer.setVisible(type === 'satellite');
    }

    public toggleCoverageLegend(): void {
        this.coverageLegendOpen.update((v) => !v);
    }

    public toggleEquipment(type: string, visible: boolean): void {
        this.equipmentsVisible.update((vis) => ({ ...vis, [type]: visible }));
        this.updateEquipmentLayer();
    }

    public toggleAllEquipments(visible: boolean): void {
        this.equipmentsVisible.set(
            Object.fromEntries(
                this.equipmentOptions.map((eq) => [eq.id, visible])
            )
        );
        this.updateEquipmentLayer();
    }

    /**
     * Recharge la couche de tuiles d'infrastructures selon les types
     * d'équipements cochés. Le filtrage par type est délégué au backend
     * (paramètre `tag`), pas de re-filtrage côté client.
     */
    private updateEquipmentLayer(): void {
        this.clearEquipmentLayers();

        if (!this.map || !this.olModules) {
            console.warn(
                '[management-map] Carte non initialisée, impossible de charger les tuiles d’équipements.'
            );
            return;
        }

        const selected = this.equipmentOptions.filter(
            (eq) => this.equipmentsVisible()[eq.id]
        );
        if (!selected.length) {
            // Aucun type coché : état normal, pas d'appel à faire.
            return;
        }

        const reportUniqId = this.reportUniqId();
        console.log('reportUniqId: ', reportUniqId);
        if (!reportUniqId) {
            console.warn(
                '[management-map] reportUniqId manquant : la tuile ' +
                    "d'équipements ne peut pas être appelée (voir " +
                    'input [reportUniqId] sur <app-management-map> et ' +
                    'items().reportUniqId côté management-dialog).'
            );
            return;
        }

        const tags = selected.map((eq) => this.toInfrastructureTileTag(eq.id));
        const url = this.reportsApi.getReportInfrastructureTilesUrl(
            reportUniqId,
            tags
        );
        if (!url) {
            console.warn(
                '[management-map] URL de tuiles vide malgré reportUniqId et ' +
                    'types sélectionnés — vérifier getReportInfrastructureTilesUrl.'
            );
            return;
        }

        console.debug('[management-map] Chargement tuiles équipements:', url);

        const { VectorTileLayer, VectorTileSource, MVT } = this.olModules;
        const layer = new VectorTileLayer({
            declutter: false,
            renderMode: 'hybrid',
            style: (feature: any): any =>
                this.createEquipmentTileStyle(feature),
            zIndex: 1,
        });

        layer.setSource(
            new VectorTileSource({
                format: new MVT({ idProperty: 'id' }),
                maxZoom: 22,
                transition: 160,
                url,
                wrapX: false,
                tileLoadFunction: createAuthenticatedVectorTileLoader(() =>
                    this.buildTileRequestHeaders()
                ),
            })
        );

        this.equipmentLayers.set('equipment', layer);
        this.map.addLayer(layer);
    }

    private clearEquipmentLayers(): void {
        if (!this.map) {
            return;
        }
        for (const layer of this.equipmentLayers.values()) {
            this.map.removeLayer(layer);
        }
        this.equipmentLayers.clear();
    }

    private createEquipmentTileStyle(feature: any): any {
        const {
            Style,
            Circle: CircleStyle,
            Fill,
            Stroke,
            Text,
        } = this.olModules;
        const properties = feature.getProperties() as {
            equipment_type?: string;
            type?: string;
            tag?: string;
            point_count?: number | string;
            cluster_count?: number | string;
            count?: number | string;
        };

        const type = this.normalizeEquipmentType(
            properties?.equipment_type ?? properties?.type ?? properties?.tag
        );
        const color = EQUIPMENT_TYPE_COLORS[type ?? ''] ?? '#6b7280';
        const clusterCount =
            Number(
                properties?.point_count ??
                    properties?.cluster_count ??
                    properties?.count
            ) || 0;

        if (clusterCount > 1) {
            const radius = Math.min(16 + Math.floor(clusterCount / 10), 32);
            return new Style({
                image: new CircleStyle({
                    radius,
                    fill: new Fill({ color }),
                    stroke: new Stroke({ color: '#ffffff', width: 2.5 }),
                }),
                text: new Text({
                    text: String(clusterCount),
                    fill: new Fill({ color: '#ffffff' }),
                    font: '700 12px Lato, Arial, sans-serif',
                }),
            });
        }

        return new Style({
            image: new CircleStyle({
                radius: 7,
                fill: new Fill({ color }),
                stroke: new Stroke({ color: '#ffffff', width: 2 }),
            }),
        });
    }

    private normalizeEquipmentType(value: unknown): string | undefined {
        if (typeof value !== 'string') {
            return undefined;
        }
        return value.trim().toLowerCase();
    }

    private toInfrastructureTileTag(equipmentId: string): string {
        return equipmentId
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toUpperCase();
    }

    /**
     * Nombre d'infrastructures impact\u00e9es pour un type d'\u00e9quipement donn\u00e9
     * (voir `equipmentOptions`), \u00e0 afficher \u00e0 c\u00f4t\u00e9 de chaque case \u00e0 cocher
     * du panneau "Filtres sur les couches". Retourne 0 tant que les stats
     * ne sont pas charg\u00e9es ou si le tag est absent de la r\u00e9ponse API.
     * @param equipmentId
     */
    public getInfrastructureCount(equipmentId: string): number {
        const key = this.toInfrastructureTileTag(equipmentId);
        return this.infrastructureCounts()[key] ?? 0;
    }

    /**
     * Charge les statistiques d'infrastructures impact\u00e9es pour le
     * signalement courant (`impacts/infrastructures/{reportUniqId}/stats`)
     * et les normalise en `{ TAG_NORMALIS\u00c9: count }` (voir
     * `toInfrastructureTileTag`) pour un lookup ind\u00e9pendant de la casse et
     * des accents renvoy\u00e9s par le backend.
     * @param reportUniqId
     */
    private loadInfrastructureStats(reportUniqId: string | undefined): void {
        if (!reportUniqId) {
            this.infrastructureCounts.set({});
            return;
        }

        this.reportsApi
            .getReportInfrastructureStats(reportUniqId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (response) => {
                    this.infrastructureCounts.set(
                        this.normalizeInfrastructureStats(response)
                    );
                },
                error: (error) => {
                    console.warn(
                        "[management-map] \u00c9chec du chargement des statistiques d'infrastructures impact\u00e9es :",
                        error
                    );
                    this.infrastructureCounts.set({});
                },
            });
    }

    /**
     * Parsing d\u00e9fensif de la r\u00e9ponse stats : la forme exacte renvoy\u00e9e par
     * le backend (tableau `{ tag, infrastructures_count }` ou objet index\u00e9
     * par tag) n'\u00e9tant pas garantie, on g\u00e8re les deux cas et on retombe sur
     * `count` si `infrastructures_count` est absent.
     * @param response
     */
    private normalizeInfrastructureStats(
        response: unknown
    ): Record<string, number> {
        const result: Record<string, number> = {};
        if (!response) {
            return result;
        }

        const setCount = (rawTag: unknown, rawCount: unknown): void => {
            if (typeof rawTag !== 'string' || !rawTag.trim()) {
                return;
            }
            const count = Number(rawCount);
            if (Number.isNaN(count)) {
                return;
            }
            result[this.toInfrastructureTileTag(rawTag)] = count;
        };

        const extractCount = (value: unknown): unknown => {
            if (value && typeof value === 'object') {
                const item = value as InfrastructureImpactStatItem;
                return item.infrastructures_count ?? item.count;
            }
            return value;
        };

        if (Array.isArray(response)) {
            for (const item of response as InfrastructureImpactStatItem[]) {
                if (!item || typeof item !== 'object') {
                    continue;
                }
                const tag = item.tag ?? item.type ?? item.equipment_type;
                setCount(tag, extractCount(item));
            }
            return result;
        }

        if (typeof response === 'object') {
            for (const [tag, value] of Object.entries(
                response as Record<string, unknown>
            )) {
                setCount(tag, extractCount(value));
            }
        }

        return result;
    }

    private buildTileRequestHeaders(): HeadersInit {
        const headers: Record<string, string> = {
            'X-Environment': this.configurationService.environment,
        };
        const tokenData: AuthToken | null =
            this.encodingService.getData('token_data');
        const token = tokenData?.value;

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    }

    private addMarker(): void {
        const { Feature, Point, VectorLayer, VectorSource } = this.olModules;

        const marker = new Feature({
            geometry: new Point(
                this.olModules.fromLonLat([this.longitude(), this.latitude()])
            ),
        });

        const source = new VectorSource({ features: [marker] });
        // Style en fonction (pas un Style statique) : réévalué à chaque
        // rendu OpenLayers, donc la taille de l'icône suit le zoom en
        // continu — même mécanisme que le style de couche des clusters
        // dans interactive-map's MapAdapter.
        this.markerLayer = new VectorLayer({
            source,
            zIndex: 5,
            style: (): any => this.createMarkerStyle(),
        });
        this.map.addLayer(this.markerLayer);
    }

    /**
     * Style du marqueur de signalement. Icône par type de signalement à
     * taille identique à interactive-map (mêmes bornes px et mêmes bornes
     * de zoom, voir REPORT_ICON_MIN_PX/MAX_PX et MAP_ICON_MIN_ZOOM/MAX_ZOOM
     * dans MapAdapter) ; repli sur le pin générique coloré sinon.
     */
    private createMarkerStyle(): any {
        const { Style, Icon } = this.olModules;
        const iconPath = getReportTypeIconPath(this.reportType());

        if (iconPath) {
            const size = this.getReportIconPixelSize();
            return new Style({
                image: new Icon({
                    src: iconPath,
                    width: size,
                    height: size,
                    anchor: [0.5, 0.5],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'fraction',
                }),
            });
        }

        return new Style({
            image: new Icon({
                src: this.generateMarkerSvg(
                    MARKER_TYPE_COLORS[this.markerType()] ?? this.markerColor()
                ),
                scale: 0.8,
                anchor: [0.5, 1],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
            }),
        });
    }

    /**
     * Interpolation de taille d'icône selon le zoom, identique à
     * interactive-map's MapAdapter.getReportIconPixelSize() : mêmes bornes
     * (20-50px, zoom 7-18, courbe sub-linéaire t^0.75) pour un rendu visuel
     * cohérent entre les deux cartes.
     */
    private getReportIconPixelSize(): number {
        return this.getZoomIconPixelSize(
            ManagementMapComponent.REPORT_ICON_MIN_PX,
            ManagementMapComponent.REPORT_ICON_MAX_PX
        );
    }

    private getZoomIconPixelSize(minPx: number, maxPx: number): number {
        if (!this.map) {
            return Math.round((minPx + maxPx) / 2);
        }

        const zoom = this.map.getView().getZoom() ?? 10;
        const t = Math.min(
            Math.max(
                (zoom - ManagementMapComponent.MAP_ICON_MIN_ZOOM) /
                    (ManagementMapComponent.MAP_ICON_MAX_ZOOM -
                        ManagementMapComponent.MAP_ICON_MIN_ZOOM),
                0
            ),
            1
        );

        const eased = Math.pow(t, 0.75);
        return Math.round(minPx + eased * (maxPx - minPx));
    }

    /**
     * Cercle d'impact géographique (rayon réel en mètres) autour du
     * signalement : projeté en EPSG:3857, sa taille à l'écran grandit/
     * rétrécit naturellement avec le zoom, comme une vraie distance sur
     * la carte — permet de visualiser les infrastructures potentiellement
     * impactées autour du point signalé.
     */
    private addRadiusCircle(): void {
        if (!this.showRadiusCircle()) {
            return;
        }

        const {
            Feature,
            CircleGeom,
            VectorLayer,
            VectorSource,
            Style,
            Fill,
            Stroke,
        } = this.olModules;

        const center = this.olModules.fromLonLat([
            this.longitude(),
            this.latitude(),
        ]);

        // Même couleur que l'icône du signalement affichée sur le
        // marqueur ; repli sur le bleu générique si aucun type connu.
        const color = getReportTypeColor(this.reportType()) ?? '#2563eb';

        const circleFeature = new Feature({
            geometry: new CircleGeom(center, this.radiusMeters()),
        });
        circleFeature.setStyle(
            new Style({
                fill: new Fill({ color: hexToRgba(color, 0.08) }),
                stroke: new Stroke({
                    color,
                    width: 2,
                    lineDash: [6, 6],
                }),
            })
        );

        const source = new VectorSource({ features: [circleFeature] });
        this.radiusLayer = new VectorLayer({ source, zIndex: 4 });
        this.map.addLayer(this.radiusLayer);
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
        this.map.on('click', (evt: any) => {
            const feature = this.map.forEachFeatureAtPixel(
                evt.pixel,
                (ft: any) => ft
            );

            if (feature && this.enablePopup()) {
                const coordinates = feature.getGeometry().getCoordinates();
                this.popupOverlay.setPosition(coordinates);

                this.ngZone.run(() => {
                    this.selectedMarker.set({
                        id: 'main-marker',
                        latitude: this.latitude(),
                        longitude: this.longitude(),
                        title: this.markerTitle(),
                        description: this.markerDescription(),
                        color: this.markerColor(),
                    });

                    this.showPopup.set(true);
                });
            } else {
                this.ngZone.run(() => this.showPopup.set(false));
            }
        });

        this.map.getView().on('change', () => {
            const center = this.map.getView().getCenter();
            if (center) {
                const [longitude, latitude] = this.olModules.toLonLat(center);
                this.ngZone.run(() => {
                    this.mapViewState.update((state) => ({
                        ...state,
                        latitude,
                        longitude,
                    }));
                });
            }
        });
    }

    public recenterMap(): void {
        if (this.map && this.olModules) {
            const { fromLonLat } = this.olModules;
            this.map.getView().animate({
                center: fromLonLat([this.longitude(), this.latitude()]),
                zoom: this.zoom(),
                duration: 1000,
            });
        }
    }

    public togglePopup(visible: boolean): void {
        this.showPopup.set(visible);
    }

    public copyCoordinates(): void {
        const text = `${this.latitude()}, ${this.longitude()}`;
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            navigator.clipboard
                .writeText(text)
                .catch(() =>
                    console.warn('Impossible de copier les coordonnées')
                );
        }
    }

    private cleanupMap(): void {
        if (this.map) {
            this.map.setTarget(undefined);
            this.map.dispose();
        }
    }
}
