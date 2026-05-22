import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
    effect,
    inject,
    signal,
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
    MapAdapter,
} from '@pages/interactive-map/presentation/adapters/map.adapter';
import {
    GeolocationErrorType,
    GeolocationService,
} from '@pages/interactive-map/presentation/services/geolocation.service';
import { MapStore } from '@pages/interactive-map/presentation/store/map.store';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { parseCoordinates } from '@shared/components/location-picker/utils/coordinates.utils';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
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
        CommonModule,
        BreadcrumbComponent,
        PageTitleComponent,
        FormsModule,
        TranslateModule,
        ButtonModule,
        InputTextModule,
        InputGroupModule,
        InputGroupAddonModule,
    ],
    templateUrl: './interactive-map.component.html',
    styleUrls: ['./interactive-map.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InteractiveMapComponent
    implements OnInit, AfterViewInit, OnDestroy
{
    @ViewChild('mapContainer', { static: true })
    private mapContainer!: ElementRef<HTMLElement>;

    public readonly store = inject(MapStore);
    public readonly clusterTooltip = signal<ClusterTooltip | null>(null);
    public readonly filtersPanelOpen = signal(true);
    public readonly locationSearchQuery = signal('');
    public readonly locationSearchResults = signal<LocationSearchResult[]>([]);
    public readonly locationSearchLoading = signal(false);
    public readonly locationSearchError = signal<string | null>(null);

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
        this.listenToMapMoves();
        this.listenToMapSelections();
        this.initializeBoundsFromMap();
        this.urlSyncReady = true;
    }

    ngOnDestroy(): void {
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
                    if (error.type === GeolocationErrorType.PERMISSION_DENIED) {
                        this.store.denyPermission();
                    }
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

    public setDateFilter(key: 'dateFrom' | 'dateTo', value: string): void {
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
        this.mapAdapter.setSelectedReport(null);
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
    }

    public releaseHoverTooltip(): void {
        this.hoverTooltipLocked = false;
        this.clusterTooltip.set(null);
    }

    private setupStoreEffects(): void {
        effect(() => {
            const position = this.store.userPosition();
            if (position && this.mapAdapter.isReady()) {
                this.mapAdapter.setCenter(position.lat, position.lng);
                setTimeout(() => this.initializeBoundsFromMap(), 1000);
            }
        });

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
        this.mapAdapter.init(this.mapContainer.nativeElement, {
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
            .pipe(debounceTime(700), takeUntilDestroyed(this.destroyRef))
            .subscribe((bounds) => {
                this.store.setBounds(bounds);

                const view = this.mapAdapter.getViewState();
                if (view) {
                    this.store.setView(view);
                }
            });
    }

    private listenToMapSelections(): void {
        this.mapAdapter
            .onReportClick()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((report) => this.store.setSelectedReport(report));

        this.mapAdapter
            .onClusterTooltip()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((tooltip) => {
                if (!tooltip && this.hoverTooltipLocked) {
                    return;
                }

                this.clusterTooltip.set(tooltip);
            });
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
            dateFrom: query.get('from') || '',
            dateTo: query.get('to') || '',
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
                from: filters.dateFrom || null,
                to: filters.dateTo || null,
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
}
