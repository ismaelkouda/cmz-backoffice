import { HttpClient } from '@angular/common/http';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    ElementRef,
    OnDestroy,
    OnInit,
    effect,
    inject,
    signal,
    viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
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
import { MapStore } from '@pages/interactive-map/presentation/store/map.store';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { parseCoordinates } from '@shared/components/location-picker/utils/coordinates.utils';
import { ManagementDialogComponent } from '@shared/components/management/presentation/management-dialog/management-dialog.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { TypeReport } from '@shared/domain/enums/type-report.enum';
import { ToastrService } from 'ngx-toastr';
import { Coordinate } from 'ol/coordinate';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
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
        PageTitleComponent,
        ManagementDialogComponent,
        FormsModule,
        TranslateModule,
        SelectModule,
        ButtonModule,
        InputTextModule,
        InputGroupModule,
        InputGroupAddonModule,
        DatePickerModule,
    ],
    templateUrl: './interactive-map.component.html',
    styleUrls: ['./interactive-map.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InteractiveMapComponent
    implements OnInit, AfterViewInit, OnDestroy
{
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
    protected readonly isVisibleDialog = signal<boolean>(false);
    protected readonly selectedManagementType = signal<TypeReport | null>(
        TypeReport.PROCESSING
    );

    protected selectedReportId: string | null = null;

    public readonly reportTypeOptions: {
        value: ReportType;
        label: string;
    }[] = [
        { value: 'zob', label: 'Zone blanche' },
        { value: 'cpo', label: "Absence d'operateur" },
        { value: 'cps', label: 'Mauvais signal' },
        { value: 'abi', label: "Absence d'internet" },
    ];
    public readonly operatorOptions: {
        value: ReportOperator;
        label: string;
    }[] = [
        { value: 'orange', label: 'Orange' },
        { value: 'moov', label: 'Moov' },
        { value: 'mtn', label: 'MTN' },
    ];
    public readonly statusOptions: {
        value: ReportStatus;
        label: string;
    }[] = [
        { value: 'pending', label: 'En attente' },
        { value: 'approved', label: 'Approuve' },
        { value: 'in-progress', label: 'En cours' },
        { value: 'rejected', label: 'Rejete' },
        { value: 'abandoned', label: 'Abandonne' },
    ];

    private readonly geolocationService = inject(GeolocationService);
    private readonly mapAdapter = inject(MapAdapter);
    private readonly reportsApi = inject(InteractiveMapReportsApi);
    private readonly http = inject(HttpClient);
    private readonly destroyRef = inject(DestroyRef);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly toastr = inject(ToastrService);
    private readonly locationSearchSubject = new Subject<string>();
    private hoverTooltipLocked = false;
    private hoverHideTimer: ReturnType<typeof setTimeout> | null = null;
    private urlSyncReady = false;

    constructor() {
        this.setupStoreEffects();
    }

    ngOnInit(): void {
        this.restoreStateFromUrl();
        this.setupLocationSearch();
        this.checkInitialPermission();
    }

    ngAfterViewInit(): void {
        this.initMap();
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
    }

    ngOnDestroy(): void {
        this.clearHoverHideTimer();
        this.mapAdapter.destroy();
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
        this.loadReports();
    }

    public toggleFiltersPanel(): void {
        this.filtersPanelOpen.update((isOpen) => !isOpen);
        setTimeout(() => this.mapAdapter.updateSize(true), 260);
    }

    public toggleFilter<T extends keyof ReportFilters>(
        key: T,
        value: ReportFilters[T] extends (infer U)[] ? U : never,
        checked: boolean
    ): void {
        const current = this.store.filters()[key];

        if (!Array.isArray(current)) {
            return;
        }

        const next = checked
            ? [...current, value]
            : current.filter((item) => item !== value);
        this.store.updateFilters({ [key]: next } as Partial<ReportFilters>);
    }

    public setStatuses(statuses: HTMLSelectElement): void {
        const values = Array.from(statuses.selectedOptions).map(
            (option) => option.value as ReportStatus
        );
        this.store.updateFilters({ statuses: values });
    }

    public setMunicipality(value: string): void {
        this.store.updateFilters({ municipality: value });
    }

    public setDateFilter(key: 'startDate' | 'endDate', value: string): void {
        this.store.updateFilters({ [key]: value });
    }

    public setCompareOperator(value: ReportOperator | ''): void {
        this.store.updateFilters({ compareOperator: value });
    }

    public resetFilters(): void {
        this.store.resetFilters();
    }

    public toggleHeatmap(): void {
        this.store.setHeatmapEnabled(!this.store.heatmapEnabled());
    }

    public focusReport(report: InteractiveMapReport): void {
        this.store.setSelectedReport(report);
        this.mapAdapter.focusReport(report);
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
            .updateStatus(report.id, status)
            .pipe(
                tap(() => {
                    this.toastr.success('Statut mis a jour');
                    this.store.setSelectedReport(null);
                    this.loadReports();
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
        console.log('status: ', status);
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
        // effect(() => {
        //     const position = this.store.userPosition();
        //     console.log('position: ', position);
        //     if (position && this.mapAdapter.isReady()) {
        //         this.mapAdapter.setCenter(position.lat, position.lng);
        //         setTimeout(() => this.initializeBoundsFromMap(), 1000);
        //     }
        // });

        effect(() => {
            const reports = this.store.visibleReports();
            const heatmapEnabled = this.store.heatmapEnabled();
            if (this.mapAdapter.isReady()) {
                this.mapAdapter.renderReports(reports, heatmapEnabled);
            }
        });

        effect(() => {
            const bounds = this.store.bounds();
            const filters = this.store.filters();

            if (bounds) {
                this.loadReports(bounds, filters);
            }
        });

        effect(() => {
            const bounds = this.store.bounds();
            const filters = this.store.filters();
            const view = this.store.view();
            const heatmap = this.store.heatmapEnabled();

            if (this.urlSyncReady && bounds) {
                this.syncUrl(bounds, filters, view, heatmap);
            }
        });
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
        });
    }

    private initializeBoundsFromMap(): void {
        const bounds = this.mapAdapter.getConstrainedBounds();
        const view = this.mapAdapter.getViewState();

        if (bounds) {
            this.store.setBounds(bounds);
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
                console.log('bounds: ', bounds);
                this.store.setBounds(bounds);
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
        if (!info.reports.length) {
            this.store.setSelectedReport(null);
            this.selectedClusterReports.set([]);
            this.selectedClusterSummary.set(null);
            return;
        }

        if (info.kind === 'cluster') {
            this.store.setSelectedReport(null);
            this.selectedClusterReports.set(info.reports);
            this.selectedClusterSummary.set(info.summary ?? null);
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

    private loadReports(
        bounds = this.store.bounds(),
        filters = this.store.filters()
    ): void {
        if (!bounds) {
            return;
        }

        this.store.startLoading();
        this.reportsApi
            .getReports(bounds, filters)
            .pipe(
                tap((reports) => this.store.setReports(reports)),
                catchError(() => {
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
        const lat = Number(query.get('lat'));
        const lng = Number(query.get('lng'));
        const zoom = Number(query.get('zoom'));

        if (Number.isFinite(lat) && Number.isFinite(lng)) {
            this.store.setView({
                center: { lat, lng },
                zoom: Number.isFinite(zoom) ? zoom : this.store.view().zoom,
            });
        }

        this.store.updateFilters({
            reportTypes: this.readArrayParam<ReportType>('types'),
            operators: this.readArrayParam<ReportOperator>('operators'),
            statuses: this.readArrayParam<ReportStatus>('statuses'),
            municipality: query.get('municipality') || '',
            startDate: query.get('from') || '',
            endDate: query.get('to') || '',
            compareOperator:
                (query.get('compare') as ReportOperator | null) || '',
        });

        this.store.setHeatmapEnabled(query.get('heatmap') === '1');
    }

    private syncUrl(
        bounds: NonNullable<ReturnType<MapStore['bounds']>>,
        filters: ReportFilters,
        view: NonNullable<ReturnType<MapStore['view']>>,
        heatmap: boolean
    ): void {
        console.log('bounds: ', bounds);
        console.log('heatmap: ', heatmap);
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
        console.log('item: ', item);
        this.selectedReportId = item.uniq_id;
        this.isVisibleDialog.set(true);
    }
    protected onVisibleDialogClicked(event: boolean): void {
        this.isVisibleDialog.set(event);
    }
}
