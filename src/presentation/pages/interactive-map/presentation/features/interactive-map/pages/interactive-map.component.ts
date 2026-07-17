import { HttpClient } from '@angular/common/http';
import {
    AfterViewInit,
    Component,
    computed,
    DestroyRef,
    ElementRef,
    OnDestroy,
    OnInit,
    effect,
    inject,
    signal,
    viewChild,
    ChangeDetectionStrategy,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { RegionsSelectFacade } from '@pages/administrative-boundary/application/services/regions/regions-select.facade';
import {
    InteractiveMapReport,
    ReportFilters,
    ReportOperator,
    ReportStatus,
    ReportType,
} from '@pages/interactive-map/domain/models/interactive-map-report.model';
import { InteractiveMapReportsApi } from '@pages/interactive-map/infrastructure/data/sources/interactive-map-reports.api';
import {
    ClusterTooltip,
    MapClickInfo,
    MapAdapter,
} from '@pages/interactive-map/presentation/adapters/map.adapter';
import { GeolocationService } from '@pages/interactive-map/presentation/services/geolocation.service';
import {
    EMPTY_REPORT_FILTERS,
    MapStore,
} from '@pages/interactive-map/presentation/store/map.store';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { parseCoordinates } from '@shared/components/location-picker/utils/coordinates.utils';
import { ManagementDialogComponent } from '@shared/components/management/presentation/management-dialog/management-dialog.component';
import { TypeReport } from '@shared/domain/enums/type-report.enum';
import { ToastrService } from 'ngx-toastr';
import { Coordinate } from 'ol/coordinate';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { BadgeModule } from 'primeng/badge';
import {
    EMPTY,
    Subject,
    catchError,
    debounceTime,
    distinctUntilChanged,
    filter,
    finalize,
    map,
    of,
    switchMap,
    tap,
} from 'rxjs';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { toLonLat } from 'ol/proj';

interface LocationSearchResult {
    displayName: string;
    lat: number;
    lng: number;
}

interface NominatimSearchResult {
    display_name: string;
    lat: string;
    lon: string;
}

@Component({
    selector: 'app-interactive-map',
    standalone: true,
    imports: [
        BreadcrumbComponent,
        ManagementDialogComponent,
        FormsModule,
        TranslateModule,
        SelectModule,
        ButtonModule,
        InputTextModule,
        InputGroupModule,
        InputGroupAddonModule,
        DatePickerModule,
        TagModule,
        BadgeModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [MapAdapter, MapStore],
    templateUrl: './interactive-map.component.html',
    styleUrls: ['./interactive-map.component.scss'],
})
export class InteractiveMapComponent
    implements OnInit, AfterViewInit, OnDestroy
{
    public readonly allOperatorsVisible = computed(() => {
        const visibility = this.coverageOperatorVisibility();
        return Object.values(visibility).every((v) => v === true);
    });
    public getReportIconPath(type: ReportType): string {
        const icons: Record<ReportType, string> = {
            zob: 'assets/images/icones/marker-zb.svg',
            cpo: 'assets/images/icones/marker-ao.svg',
            cps: 'assets/images/icones/marker-ms.svg',
            abi: 'assets/images/icones/marker-ai.svg',
        };
        return icons[type] || '';
    }
    public readonly COVERAGE_OPERATORS: {
        id: string;
        label: string;
        color: string;
    }[] = [
        { id: 'oci', label: 'OCI', color: '#ff7900' },
        { id: 'cit', label: 'CIT', color: '#ff7900' },
        { id: 'ihs (oci)', label: 'IHS (OCI)', color: '#ff7900' },
        { id: 'mtn', label: 'MTN', color: '#ffcc00' },
        { id: 'ihs (mtn)', label: 'IHS (MTN)', color: '#ffcc00' },
        { id: 'moov', label: 'Moov', color: '#005baa' },
        { id: 'moov (coloas)', label: 'Moov (Coloas)', color: '#005baa' },
        { id: 'idt', label: 'IDT', color: '#e6194B' },
        { id: 'ihs', label: 'IHS', color: '#bfef45' },
        { id: 'presidence', label: 'Présidence', color: '#4363d8' },
        { id: 'cafe mobile', label: 'Café Mobile', color: '#fabed4' },
        { id: 'green', label: 'Green', color: '#469990' },
    ];
    public readonly coverageLegendOpen = signal(true);
    public readonly coverageOperatorVisibility = signal<
        Record<string, boolean>
    >(Object.fromEntries(this.COVERAGE_OPERATORS.map((op) => [op.id, false])));
    public readonly currentBaseMap = signal<'osm' | 'satellite'>('osm');
    private readonly mapShell = viewChild<ElementRef<HTMLElement>>('mapShell');
    private readonly mapContainer =
        viewChild<ElementRef<HTMLElement>>('mapContainer');
    private readonly hoverOverlay =
        viewChild<ElementRef<HTMLElement>>('hoverOverlay');
    private readonly clickOverlay =
        viewChild<ElementRef<HTMLElement>>('clickOverlay');

    public readonly store = inject(MapStore);
    public readonly clusterTooltip = signal<ClusterTooltip | null>(null);
    public readonly selectedClusterReports = signal<InteractiveMapReport[]>([]);
    public readonly selectedClusterSummary = signal<
        ClusterTooltip['summary'] | null
    >(null);
    public readonly filtersPanelOpen = signal(true);
    public readonly locationSearchQuery = signal('');
    public readonly locationSearchResults = signal<LocationSearchResult[]>([]);
    public readonly locationSearchLoading = signal(false);
    public readonly locationSearchError = signal<string | null>(null);
    public readonly coverageAreasVisible = signal(true);
    public readonly coverageNetworkTechnology = signal('');
    public readonly draftFilters = signal<ReportFilters>(
        this.cloneFilters(EMPTY_REPORT_FILTERS)
    );
    public readonly isFullscreen = signal(false);
    protected readonly isVisibleDialog = signal<boolean>(false);
    protected readonly selectedManagementType = signal<TypeReport | null>(
        TypeReport.PROCESSING
    );
    protected readonly selectedReportId = signal<string>('');
    public readonly regionSelectOptions = computed(() => [
        ...this.regionOptions().map((r) => ({ label: r.name, value: r.value })),
    ]);

    public readonly departmentSelectOptions = computed(() => {
        return [
            ...this.departmentOptions().map((d) => ({
                label: d.name,
                value: d.value,
            })),
        ];
    });

    public readonly municipalitySelectOptions = computed(() => {
        return [
            ...this.municipalityOptions().map((m) => ({
                label: m.name,
                value: m.value,
            })),
        ];
    });

    public readonly statusSelectOptions = computed(() => [
        ...this.statusOptions,
    ]);

    public readonly currentStatus = computed(
        () => this.draftFilters().statuses[0] || ''
    );

    public setStatus(value: string): void {
        this.updateDraftFilters({
            statuses: value ? [value as ReportStatus] : [],
        });
    }
    public readonly reportTypeOptions: { value: ReportType; label: string }[] =
        [
            { value: 'zob', label: 'Aucun réseau' },
            { value: 'cpo', label: "Absence d'Opérateur(s)" },
            { value: 'cps', label: "Mauvais signal d'Opérateur(s)" },
            { value: 'abi', label: "Absence d'Internet" },
        ];
    public readonly operatorOptions: {
        value: ReportOperator;
        label: string;
    }[] = [
        { value: 'orange', label: 'Orange' },
        { value: 'moov', label: 'Moov' },
        { value: 'mtn', label: 'MTN' },
    ];
    public readonly statusOptions: { value: ReportStatus; label: string }[] = [
        { value: 'processing', label: 'En cours' },
        { value: 'finalization', label: 'Clôturé' },
    ];
    public readonly networkTechnologyOptions = [
        { value: 'fo', label: 'Fibre optique' },
        { value: 'fr', label: 'Faiseau radio' },
    ];
    public readonly rnhdVisibility = signal<Record<string, boolean>>(
        Object.fromEntries(
            this.networkTechnologyOptions.map((op) => [op.value, false])
        )
    );

    public rnhdVisible(value: string): boolean {
        return this.rnhdVisibility()[value] ?? false;
    }

    public toggleRnhd(value: string, visible: boolean): void {
        this.rnhdVisibility.update((vis) => ({
            ...vis,
            [value]: visible,
        }));
    }
    public readonly equipmentOptions: { id: string; label: string }[] = [
        { id: 'education', label: 'Education' },
        { id: 'sante', label: 'Santé' },
        { id: 'administration', label: 'Administration' },
        { id: 'securité', label: 'Sécurité' },
    ];
    public readonly equipmentsVisible = signal<Record<string, boolean>>(
        Object.fromEntries(this.equipmentOptions.map((eq) => [eq.id, false]))
    );

    public readonly allEquipmentsVisible = computed(() => {
        const vis = this.equipmentsVisible();
        return Object.values(vis).every((v) => v === true);
    });

    public toggleEquipment(type: string, visible: boolean): void {
        this.equipmentsVisible.update((vis) => ({
            ...vis,
            [type]: visible,
        }));
        this.mapAdapter.setEquipmentTypeVisible(type, visible);
    }

    public toggleAllEquipments(visible: boolean): void {
        const newVisibility = Object.fromEntries(
            this.equipmentOptions.map((eq) => [eq.id, visible])
        );
        this.equipmentsVisible.set(newVisibility);
        for (const eq of this.equipmentOptions) {
            this.mapAdapter.setEquipmentTypeVisible(eq.id, visible);
        }
    }

    private readonly geolocationService = inject(GeolocationService);
    private readonly mapAdapter = inject(MapAdapter);
    private readonly reportsApi = inject(InteractiveMapReportsApi);
    private readonly http = inject(HttpClient);
    private readonly destroyRef = inject(DestroyRef);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly toastr = inject(ToastrService);
    private readonly regionsFacade = inject(RegionsSelectFacade);
    private readonly regions = toSignal(this.regionsFacade.items$, {
        initialValue: [],
    });
    public readonly regionOptions = computed(() => this.regions());
    public readonly departmentOptions = computed(() => {
        const region = this.regions().find(
            (item) => item.value === this.draftFilters().region
        );
        return region?.departments ?? [];
    });
    public readonly municipalityOptions = computed(() => {
        const department = this.departmentOptions().find(
            (item) => item.value === this.draftFilters().department
        );
        return department?.municipalities ?? [];
    });
    private readonly locationSearchSubject = new Subject<string>();
    private hoverTooltipLocked = false;
    private hoverHideTimer: ReturnType<typeof setTimeout> | null = null;
    private urlSyncReady = false;
    private ignoreNextMapMove = false;
    private mapResizeObserver: ResizeObserver | null = null;
    private readonly handleFullscreenChange = (): void => {
        this.isFullscreen.set(
            document.fullscreenElement === this.mapShell()?.nativeElement
        );
        this.ignoreNextMapMove = true;
        setTimeout(() => this.mapAdapter.updateSize(true), 80);
    };

    constructor() {
        this.setupStoreEffects();
    }

    ngOnInit(): void {
        this.restoreStateFromUrl();
        this.draftFilters.set(this.cloneFilters(this.store.filters()));
        this.regionsFacade.readAll({ forceRefresh: true });
        this.setupLocationSearch();
        this.checkInitialPermission();
    }

    ngAfterViewInit(): void {
        this.initMap();
        this.updateCoverageAreaTileLayer();
        this.updateEquipmentAreaTileLayer();
        const hoverEl = this.hoverOverlay()?.nativeElement;
        const clickEl = this.clickOverlay()?.nativeElement;
        if (hoverEl) {
            this.mapAdapter.setHoverOverlayElement(hoverEl);
        }
        if (clickEl) {
            this.mapAdapter.setClickOverlayElement(clickEl);
        }
        this.listenToMapMoves();
        this.listenToMapSelections();
        this.initializeBoundsFromMap();
        this.urlSyncReady = true;
        document.addEventListener(
            'fullscreenchange',
            this.handleFullscreenChange
        );
        this.setupMapResizeObserver();
    }

    ngOnDestroy(): void {
        this.clearHoverHideTimer();
        document.removeEventListener(
            'fullscreenchange',
            this.handleFullscreenChange
        );
        this.mapResizeObserver?.disconnect();
        this.mapAdapter.destroy();
    }

    /**
     * Garde la carte OpenLayers synchronisée avec la taille réelle de son
     * conteneur pendant toute animation CSS (ouverture/fermeture des
     * panneaux). Sans cela, le canvas de la carte ne se met à jour qu'une
     * seule fois (via un setTimeout), ce qui produit un "saut"/décalage
     * visible de la carte le temps que la transition CSS se termine.
     */
    private setupMapResizeObserver(): void {
        const target = this.mapContainer()?.nativeElement;
        if (!target || typeof ResizeObserver === 'undefined') {
            return;
        }

        this.mapResizeObserver = new ResizeObserver(() => {
            this.ignoreNextMapMove = true;
            this.mapAdapter.updateSize(true);
        });
        this.mapResizeObserver.observe(target);
    }

    public requestLocationPermission(): void {
        this.store.startLoading();
        this.store.setError(null);
        this.geolocationService
            .getCurrentPosition()
            .pipe(
                tap((position) => {
                    this.store.setPermission('granted');
                    this.store.setUserPosition(position);
                }),
                catchError((error) => {
                    this.store.setError(
                        this.geolocationService.getErrorMessage(error)
                    );
                    return EMPTY;
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();
    }

    public retryLoad(): void {
        const bounds = this.store.viewportBounds();
        if (bounds) {
            this.loadReportsWithBuffer(bounds);
        }
    }

    public toggleFiltersPanel(): void {
        this.filtersPanelOpen.update((isOpen) => !isOpen);
        this.ignoreNextMapMove = true;
        // Le ResizeObserver posé sur le conteneur de la carte (voir
        // setupMapResizeObserver) se charge de réappeler updateSize()
        // en continu pendant toute la transition CSS de la grille, ce
        // qui évite le décalage visuel qu'un unique appel différé
        // provoquait auparavant. On garde un appel immédiat en secours.
        this.mapAdapter.updateSize(true);
    }

    public async toggleFullscreen(): Promise<void> {
        const shell = this.mapShell()?.nativeElement;
        if (!shell) {
            return;
        }

        try {
            if (document.fullscreenElement) {
                await document.exitFullscreen();
                return;
            }
            await shell.requestFullscreen();
        } catch {
            this.toastr.error('Impossible de changer le mode plein écran');
        }
    }

    public toggleFilter<T extends keyof ReportFilters>(
        key: T,
        value: ReportFilters[T] extends (infer U)[] ? U : never,
        checked: boolean
    ): void {
        const current = this.draftFilters()[key];
        if (!Array.isArray(current)) {
            return;
        }
        const next = checked
            ? [...current, value]
            : current.filter((item) => item !== value);
        this.updateDraftFilters({ [key]: next } as Partial<ReportFilters>);
    }

    public setRegion(value: string): void {
        this.updateDraftFilters({
            region: value,
            department: '',
            municipality: '',
        });
    }

    public setDepartment(value: string): void {
        this.updateDraftFilters({
            department: value,
            municipality: '',
        });
    }

    public setMunicipality(value: string): void {
        this.updateDraftFilters({ municipality: value });
    }

    public setDateFilter(key: 'startDate' | 'endDate', value: string): void {
        this.updateDraftFilters({ [key]: value });
    }

    public setCompareOperator(value: ReportOperator | ''): void {
        this.updateDraftFilters({ compareOperator: value });
    }

    public submitFilters(): void {
        this.store.updateFilters(this.cloneFilters(this.draftFilters()));
        this.store.clearLoadedReports();
    }

    public resetFilters(): void {
        this.draftFilters.set(this.cloneFilters(EMPTY_REPORT_FILTERS));
        this.store.resetFilters();
        this.store.clearLoadedReports();
    }

    public toggleHeatmap(): void {
        this.store.setHeatmapEnabled(!this.store.heatmapEnabled());
    }

    public toggleCoverageAreas(visible: boolean): void {
        this.coverageAreasVisible.set(visible);
        if (!visible) {
            this.mapAdapter.setCoverageAreasVisible(false);
        }
    }

    public setCoverageNetworkTechnology(value: string): void {
        this.coverageNetworkTechnology.set(value);
    }

    public focusReport(report: InteractiveMapReport): void {
        this.store.setSelectedReport(report);
        this.mapAdapter.focusReport(report);
    }

    public readonly legendVisible = signal(false);
    public toggleLegend(): void {
        this.legendVisible.update((v) => !v);
    }

    public closePopup(): void {
        this.store.setSelectedReport(null);
        this.selectedClusterReports.set([]);
        this.selectedClusterSummary.set(null);
        this.mapAdapter.setSelectedReport(null);
        this.mapAdapter.hideClickOverlay();
    }

    public onLocationSearchChange(value: string): void {
        this.locationSearchQuery.set(value);
        this.locationSearchError.set(null);
        const query = value.trim();
        const coordinates = parseCoordinates(query);
        if (coordinates) {
            this.locationSearchResults.set([]);
            this.locationSearchLoading.set(false);
            this.locationSearchSubject.next('');
            this.mapAdapter.focusLocation(
                coordinates.latitude,
                coordinates.longitude,
                15
            );
            return;
        }
        this.locationSearchSubject.next(query);
    }

    public selectLocationSearchResult(result: LocationSearchResult): void {
        this.locationSearchQuery.set(result.displayName);
        this.locationSearchResults.set([]);
        this.locationSearchError.set(null);
        this.mapAdapter.focusLocation(result.lat, result.lng, 14);
    }

    public updateStatus(
        report: InteractiveMapReport,
        status: ReportStatus
    ): void {
        this.reportsApi
            .updateStatus(report.uniq_id, status)
            .pipe(
                tap(() => {
                    this.toastr.success('Statut mis a jour');
                    this.store.setSelectedReport(null);
                    const bounds = this.store.viewportBounds();
                    if (bounds) {
                        this.loadReportsWithBuffer(bounds);
                    }
                }),
                catchError(() => {
                    this.toastr.error('Impossible de modifier le statut');
                    return EMPTY;
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();
    }

    public isSelected<T>(values: T[], value: T): boolean {
        return values.includes(value);
    }

    public getReportTypeLabel(type: ReportType): string {
        return (
            this.reportTypeOptions.find((option) => option.value === type)
                ?.label || type
        );
    }

    public getStatusLabel(status: ReportStatus): string {
        return (
            this.statusOptions.find((option) => option.value === status)
                ?.label || status
        );
    }

    public getOperators(report: InteractiveMapReport): string {
        return this.normalizeOperators(report.operators)
            .map((operator) => operator.toUpperCase())
            .join(', ');
    }

    public getPlaceName(place: InteractiveMapReport['municipality']): string {
        if (!place) {
            return '-';
        }
        return typeof place === 'string' ? place : place.name || '-';
    }

    public getValidationComment(report: InteractiveMapReport): string {
        return (
            report.confirmed_comment ||
            report.approved_comment ||
            'Aucun commentaire'
        );
    }

    public keepHoverTooltip(): void {
        this.hoverTooltipLocked = true;
        this.clearHoverHideTimer();
    }

    public releaseHoverTooltip(): void {
        this.hoverTooltipLocked = false;
        this.scheduleHoverHide();
    }

    public openReportFromHover(
        report: InteractiveMapReport,
        coordinate: Coordinate
    ): void {
        this.store.setSelectedReport(report);
        this.selectedClusterReports.set([]);
        this.selectedClusterSummary.set(null);
        this.mapAdapter.setSelectedReport(report);
        this.mapAdapter.showClickOverlay(coordinate);
        this.releaseHoverTooltip();
    }

    private setupStoreEffects(): void {
        effect(() => {
            const reports = this.store.visibleReports();
            const heatmapEnabled = this.store.heatmapEnabled();
            if (this.mapAdapter.isReady()) {
                this.mapAdapter.renderReports(reports, heatmapEnabled);
            }
        });

        effect(() => {
            this.coverageAreasVisible();
            this.store.filters();
            this.coverageNetworkTechnology();
            this.coverageOperatorVisibility();
            this.rnhdVisibility();
            this.updateCoverageAreaTileLayer();
        });

        effect(() => {
            this.equipmentsVisible();
            this.updateEquipmentAreaTileLayer();
        });

        effect(() => {
            const bounds = this.store.viewportBounds();
            if (bounds && this.store.needsLoading()) {
                this.loadReportsWithBuffer(bounds);
            }
        });

        effect(() => {
            const bounds = this.store.viewportBounds();
            const filters = this.store.filters();
            const view = this.store.view();
            const heatmap = this.store.heatmapEnabled();
            if (this.urlSyncReady && bounds) {
                this.syncUrl(bounds, filters, view, heatmap);
            }
        });
    }

    private loadReportsWithBuffer(
        viewportBounds: NonNullable<ReturnType<MapStore['viewportBounds']>>
    ): void {
        const bufferBounds = this.store.expandBounds(viewportBounds, 2);
        const currentFilters = this.store.filters();

        this.store.startLoading();
        this.reportsApi
            .getReports(bufferBounds, currentFilters)
            .pipe(
                tap((reports) => {
                    this.store.mergeLoadedReports(reports, bufferBounds);
                }),
                catchError((error) => {
                    console.error('Erreur chargement signalements', error);
                    this.store.setError(
                        'Impossible de charger les signalements de cette zone.'
                    );
                    this.toastr.error('Chargement des signalements impossible');
                    return EMPTY;
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();
    }

    private updateCoverageAreaTileLayer(): void {
        if (!this.mapAdapter.isReady()) {
            return;
        }

        const visible = this.coverageAreasVisible();
        const selectedOperators = this.COVERAGE_OPERATORS.filter(
            (op) => this.coverageOperatorVisibility()[op.id]
        ).map((op) => op.id);
        const selectedNetworkTechnologies = this.networkTechnologyOptions
            .filter((op) => this.rnhdVisibility()[op.value])
            .map((op) => op.value);

        if (!visible || !selectedOperators.length) {
            this.mapAdapter.setCoverageAreasVisible(false);
            return;
        }

        const filters = this.store.filters();
        const tileUrl = this.reportsApi.getCoverageAreasTileUrl({
            operator: selectedOperators.join(',') || undefined,
            network_technology:
                selectedNetworkTechnologies.join(',') ||
                this.coverageNetworkTechnology() ||
                undefined,
            region: filters.region || undefined,
        });

        this.mapAdapter.renderCoverageAreaTiles(tileUrl, true);
    }

    private updateEquipmentAreaTileLayer(): void {
        if (!this.mapAdapter.isReady()) {
            return;
        }

        const selectedEquipments = this.equipmentOptions
            .filter((eq) => this.equipmentsVisible()[eq.id])
            .map((eq) => eq.id);

        if (!selectedEquipments.length) {
            this.mapAdapter.setEquipmentAreasVisible(false);
            return;
        }

        const tileUrl = this.reportsApi.getCoverageAreasTileUrl({
            equipment: selectedEquipments.join(','),
        });

        this.mapAdapter.renderEquipmentAreaTiles(tileUrl, true);
    }

    private checkInitialPermission(): void {
        this.geolocationService
            .getPermissionState()
            .pipe(
                tap((permission) => this.store.setPermission(permission)),
                filter((permission) => permission === 'granted'),
                switchMap(() => this.geolocationService.getCurrentPosition()),
                tap((position) => this.store.setUserPosition(position)),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();
    }

    private initMap(): void {
        const view = this.store.view();
        const map = this.mapContainer()?.nativeElement;
        if (!map) {
            this.toastr.error("Impossible d'initialiser la carte");
            return;
        }
        this.mapAdapter.init(map, {
            center: view.center,
            zoom: view.zoom,
            minZoom: 6.152954846305474, // ← zoom minimal bloqué à la valeur initiale
            maxZoom: 18,
            defaultCenter: { lat: 7.984430480342013, lng: -3.756106463052295 },
            defaultZoom: 6.152954846305474,
        });
    }

    private initializeBoundsFromMap(): void {
        const bounds = this.mapAdapter.getConstrainedBounds();
        const view = this.mapAdapter.getViewState();
        if (bounds) {
            this.store.setViewportBounds(bounds);
        }
        if (view) {
            this.store.setView(view);
        }
    }

    private listenToMapMoves(): void {
        this.mapAdapter
            .onMoveEnd()
            .pipe(debounceTime(1000), takeUntilDestroyed(this.destroyRef))
            .subscribe((bounds) => {
                if (this.ignoreNextMapMove) {
                    this.ignoreNextMapMove = false;
                    return;
                }
                console.log('Nouveaux bounds après mouvement:', bounds);
                this.store.setViewportBounds(bounds);
                const view = this.mapAdapter.getViewState();
                if (view) {
                    this.store.setView(view);
                }
            });
    }

    private listenToMapSelections(): void {
        this.mapAdapter
            .onMapClick()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((info) => this.handleMapClick(info));

        this.mapAdapter
            .onClusterTooltip()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((tooltip) => {
                if (!tooltip && this.hoverTooltipLocked) {
                    return;
                }
                if (!tooltip) {
                    this.scheduleHoverHide();
                    return;
                }
                this.clearHoverHideTimer();
                this.clusterTooltip.set(tooltip);
            });
    }

    private handleMapClick(info: MapClickInfo): void {
        console.log('info: ', info);
        if (!info.reports.length) {
            this.store.setSelectedReport(null);
            this.selectedClusterReports.set([]);
            this.selectedClusterSummary.set(null);
            return;
        }
        if (info.kind === 'cluster') {
            const currentZoom = this.mapAdapter.getViewState()?.zoom ?? 7;
            console.log('currentZoom: ', currentZoom);

            // 🆕 À fort zoom, ne plus zoomer/déplacer, afficher directement la liste
            if (currentZoom >= 16) {
                this.store.setSelectedReport(null);
                this.selectedClusterReports.set(info.reports);
                this.selectedClusterSummary.set(info.summary ?? null);
                this.mapAdapter.showClickOverlay(info.coordinate);
                return;
            }

            // Sinon, comportement normal : zoom sur le cluster
            const [lng, lat] = toLonLat(info.coordinate);
            let newZoom = Math.min(currentZoom + 2, 18);
            if (newZoom < 14) {
                newZoom = currentZoom + 3;
            }
            this.mapAdapter.focusLocation(lat, lng, newZoom);
            this.selectedClusterReports.set([]);
            this.selectedClusterSummary.set(null);
            this.mapAdapter.hideClickOverlay();
            return;
        }
        if (info.report) {
            this.store.setSelectedReport(info.report);
            this.selectedClusterReports.set([]);
            this.selectedClusterSummary.set(null);
        }
    }

    private scheduleHoverHide(): void {
        this.clearHoverHideTimer();
        this.hoverHideTimer = setTimeout(() => {
            if (this.hoverTooltipLocked) {
                return;
            }
            this.clusterTooltip.set(null);
            this.mapAdapter.hideHoverOverlay();
        }, 180);
    }

    private clearHoverHideTimer(): void {
        if (this.hoverHideTimer) {
            clearTimeout(this.hoverHideTimer);
            this.hoverHideTimer = null;
        }
    }

    private setupLocationSearch(): void {
        this.locationSearchSubject
            .pipe(
                debounceTime(350),
                distinctUntilChanged(),
                switchMap((query) => {
                    if (query.length < 3) {
                        this.locationSearchLoading.set(false);
                        this.locationSearchResults.set([]);
                        return of([]);
                    }
                    this.locationSearchLoading.set(true);
                    this.locationSearchError.set(null);
                    return this.searchFreeLocations(query).pipe(
                        catchError(() => {
                            this.locationSearchError.set(
                                'Recherche indisponible pour le moment'
                            );
                            return of([]);
                        }),
                        finalize(() => this.locationSearchLoading.set(false))
                    );
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((results) => this.locationSearchResults.set(results));
    }

    private searchFreeLocations(query: string) {
        return this.http
            .get<NominatimSearchResult[]>(
                'https://nominatim.openstreetmap.org/search',
                {
                    params: {
                        format: 'jsonv2',
                        q: query,
                        limit: '6',
                        countrycodes: 'ci',
                    },
                }
            )
            .pipe(
                map((results) =>
                    results
                        .map((result) => ({
                            displayName: result.display_name,
                            lat: Number(result.lat),
                            lng: Number(result.lon),
                        }))
                        .filter(
                            (result) =>
                                Number.isFinite(result.lat) &&
                                Number.isFinite(result.lng)
                        )
                )
            );
    }

    private restoreStateFromUrl(): void {
        const query = this.route.snapshot.queryParamMap;

        this.store.updateFilters({
            reportTypes: this.readArrayParam<ReportType>('types'),
            operators: this.readArrayParam<ReportOperator>('operators'),
            statuses: this.readArrayParam<ReportStatus>('statuses'),
            region: query.get('region') || '',
            department: query.get('department') || '',
            municipality: query.get('municipality') || '',
            startDate: query.get('from') || '',
            endDate: query.get('to') || '',
            compareOperator:
                (query.get('compare') as ReportOperator | null) || '',
        });
        this.store.setHeatmapEnabled(query.get('heatmap') === '1');
    }

    private syncUrl(
        bounds: NonNullable<ReturnType<MapStore['viewportBounds']>>,
        filters: ReportFilters,
        view: NonNullable<ReturnType<MapStore['view']>>,
        heatmap: boolean
    ): void {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {
                minLat: bounds.minLat.toFixed(5),
                maxLat: bounds.maxLat.toFixed(5),
                minLng: bounds.minLng.toFixed(5),
                maxLng: bounds.maxLng.toFixed(5),
                lat: view.center.lat.toFixed(5),
                lng: view.center.lng.toFixed(5),
                zoom: view.zoom.toFixed(2),
                types: filters.reportTypes.join(',') || null,
                operators: filters.operators.join(',') || null,
                statuses: filters.statuses.join(',') || null,
                region: filters.region || null,
                department: filters.department || null,
                municipality: filters.municipality || null,
                from: filters.startDate || null,
                to: filters.endDate || null,
                compare: filters.compareOperator || null,
                heatmap: heatmap ? '1' : null,
            },
            replaceUrl: true,
        });
    }

    private readArrayParam<T extends string>(key: string): T[] {
        const value = this.route.snapshot.queryParamMap.get(key);
        return value ? (value.split(',').filter(Boolean) as T[]) : [];
    }

    private updateDraftFilters(filters: Partial<ReportFilters>): void {
        this.draftFilters.update((current) => ({
            ...current,
            ...filters,
        }));
    }

    private cloneFilters(filters: ReportFilters): ReportFilters {
        return {
            ...filters,
            reportTypes: [...filters.reportTypes],
            operators: [...filters.operators],
            statuses: [...filters.statuses],
        };
    }

    private normalizeOperators(
        value: InteractiveMapReport['operators']
    ): ReportOperator[] {
        if (Array.isArray(value)) {
            return value;
        }
        try {
            return JSON.parse(value) as ReportOperator[];
        } catch {
            return value
                .split(',')
                .map((item) => item.trim())
                .filter(Boolean) as ReportOperator[];
        }
    }

    protected onSeeMoreInfosClicked(item: any): void {
        this.selectedReportId.set(item.uniq_id);
        this.isVisibleDialog.set(true);
    }

    protected onVisibleDialogClicked(event: boolean): void {
        this.isVisibleDialog.set(event);
    }

    public toggleCoverageLegend(): void {
        this.coverageLegendOpen.update((v) => !v);
        // Le panneau "Couches" est superposé à la carte (position absolute) :
        // il ne modifie pas la grille, mais on force quand même un recalcul
        // de taille pour rester cohérent avec le toggle du panneau de gauche.
        this.mapAdapter.updateSize(true);
    }

    public toggleCoverageOperator(operator: string, visible: boolean): void {
        this.coverageOperatorVisibility.update((vis) => ({
            ...vis,
            [operator]: visible,
        }));
        this.mapAdapter.setCoverageOperatorVisible(operator, visible);
    }

    public coverageOperatorVisible(operator: string): boolean {
        return this.coverageOperatorVisibility()[operator] ?? false;
    }

    public getCoverageColor(operator: string): string {
        return (
            this.COVERAGE_OPERATORS.find((op) => op.id === operator)?.color ||
            '#6b7280'
        );
    }

    public operatorLabel(operator: string): string {
        return (
            this.COVERAGE_OPERATORS.find((op) => op.id === operator)?.label ||
            operator
        );
    }

    public setBaseMap(type: string): void {
        this.currentBaseMap.set(type as 'osm' | 'satellite');
        this.mapAdapter.setBaseMap(type as 'osm' | 'satellite');
    }

    public toggleAllOperators(visible: boolean): void {
        // Mettre à jour le signal local
        const newVisibility = Object.fromEntries(
            Object.keys(this.coverageOperatorVisibility()).map((key) => [
                key,
                visible,
            ])
        );
        this.coverageOperatorVisibility.set(newVisibility);

        // Répercuter sur l'adaptateur
        for (const operator of Object.keys(newVisibility)) {
            this.mapAdapter.setCoverageOperatorVisible(operator, visible);
        }
    }
}
