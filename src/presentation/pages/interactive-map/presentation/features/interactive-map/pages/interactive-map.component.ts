import { CommonModule } from '@angular/common';
import {
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
    AfterViewInit,
    inject,
    DestroyRef,
    ChangeDetectionStrategy,
    effect,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MapAdapter } from '@pages/interactive-map/presentation/adapters/map.adapter';
import {
    GeolocationErrorType,
    GeolocationService,
} from '@pages/interactive-map/presentation/services/geolocation.service';
import { MapStore } from '@pages/interactive-map/presentation/store/map.store';
import { debounceTime, EMPTY, filter, switchMap, tap, catchError } from 'rxjs';
@Component({
    selector: 'app-interactive-map',
    standalone: true,
    imports: [CommonModule],
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
    private readonly geolocationService = inject(GeolocationService);
    private readonly mapAdapter = inject(MapAdapter);
    private readonly destroyRef = inject(DestroyRef);

    ngOnInit(): void {
        this.checkInitialPermission();
    }

    ngAfterViewInit(): void {
        this.initMap();
        this.listenToMapMoves();
        this.setupStoreEffects();
    }

    ngOnDestroy(): void {
        this.mapAdapter.destroy();
    }

    private setupStoreEffects(): void {
        effect(() => {
            const position = this.store.userPosition();
            if (position && this.mapAdapter.isReady()) {
                this.mapAdapter.setCenter(position.lat, position.lng);
                setTimeout(() => {
                    this.initializeBoundsFromMap();
                }, 600);
            }
        });

        effect(() => {
            const clusters = this.store.clusters();
            if (clusters && this.mapAdapter.isReady()) {
                this.mapAdapter.renderClusters(clusters);
            }
        });
    }

    private checkInitialPermission(): void {
        this.geolocationService
            .getPermissionState()
            .pipe(
                tap((permission) => this.store.setPermission(permission)),
                filter((p) => p === 'granted'),
                switchMap(() => this.geolocationService.getCurrentPosition()),
                tap((pos) => {
                    this.store.setUserPosition(pos);
                })
            )
            .subscribe();
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
        const bounds = this.store.bounds();
        if (bounds) {
            this.store.startLoading();
            // futur: this.facade.loadClusters(bounds)
        } else if (this.store.isPermissionGranted()) {
            this.initializeBoundsFromMap();
        } else {
            this.requestLocationPermission();
        }
    }

    private initMap(): void {
        if (!this.mapContainer) {
            console.error('Map container not found');
            return;
        }

        this.mapAdapter.init(this.mapContainer.nativeElement);

        // const userPosition = this.store.userPosition();

        // if (userPosition) {
        //     this.mapAdapter.setCenter(userPosition.lat, userPosition.lng);
        // }
    }

    private initializeBoundsFromMap(): void {
        const bounds = this.mapAdapter.getBounds();

        if (!bounds) {
            return;
        }

        this.store.setBounds(bounds);

        // futur: this.facade.loadClusters(bounds)
    }

    private listenToMapMoves(): void {
        this.mapAdapter
            .onMoveEnd()
            .pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
            .subscribe((bounds) => {
                this.store.setBounds(bounds);

                // futur: this.facade.loadClusters(bounds)
            });
    }
}
