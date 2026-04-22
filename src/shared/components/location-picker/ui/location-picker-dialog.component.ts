import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    OnDestroy,
    signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Coordinates } from '@shared/domain/interfaces/coordinates.interface';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import {
    debounceTime,
    distinctUntilChanged,
    filter,
    Subject,
    switchMap,
    takeUntil,
} from 'rxjs';

import { OlMapComponent } from '../components/ol-map.component';
import { LocationFacade } from '../facade/location.facade';
import { GeocodeResult } from '../models/geo-result.model';
import { LocationCoordinates } from '../models/location-coordinates.model';
import { LocationPickerData } from '../models/location-picker-data.model';
import { GeoProxyService } from '../services/geo-proxy.service';
import { GEO_SERVICE } from '../services/geo.service';
import { formatCoordinatesString } from '../utils/coordinates.utils';
import { isMobile } from '../utils/lat-lng.utils';

@Component({
    selector: 'app-location-picker-dialog',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        InputTextModule,
        InputGroupModule,
        InputGroupAddonModule,
        FormsModule,
        TranslateModule,
        OlMapComponent,
    ],
    providers: [
        LocationFacade,
        { provide: GEO_SERVICE, useClass: GeoProxyService },
    ],
    templateUrl: './location-picker-dialog.component.html',
    styleUrls: ['./location-picker-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationPickerDialogComponent implements OnDestroy {
    private readonly ref = inject(DynamicDialogRef);
    private readonly config = inject(DynamicDialogConfig<LocationPickerData>);
    public readonly facade = inject(LocationFacade);

    readonly searchQuery = signal('');
    readonly searchResults = signal<GeocodeResult[]>([]);
    readonly isSearching = signal(false);
    readonly error = signal<string | null>(null);
    readonly isMobile = signal(isMobile());

    readonly initialCoordinates = signal<Coordinates | null>(null);
    readonly initialZoom = signal<number>(15);

    readonly currentCoordinatesDisplay = computed(() => {
        const coords = this.facade.coordinates();
        if (coords) {
            return formatCoordinatesString(coords.latitude, coords.longitude);
        }
        return 'Aucune position sélectionnée';
    });

    private readonly searchSubject = new Subject<string>();
    private readonly destroy$ = new Subject<void>();

    constructor() {
        const data = this.config.data;
        if (data?.initialCoords) {
            this.facade.setCoordinates(data.initialCoords);
        }
        this.setupSearch();
    }

    private setupSearch(): void {
        this.searchSubject
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                filter((query) => query.length >= 3),
                switchMap(async (query) => {
                    this.isSearching.set(true);
                    this.error.set(null);
                    try {
                        return await this.facade.search(query);
                    } catch {
                        this.error.set('Erreur de recherche');
                        return [];
                    } finally {
                        this.isSearching.set(false);
                    }
                }),
                takeUntil(this.destroy$)
            )
            .subscribe((results) => this.searchResults.set(results));
    }

    onSearchChange(): void {
        const query = this.searchQuery();
        if (query.length < 3) {
            this.searchResults.set([]);
            this.error.set(null);
        }
        this.searchSubject.next(query);
    }
    onMapCoordinatesChange(coords: LocationCoordinates): void {
        this.facade.setCoordinates(coords);
    }
    onValidate(): void {
        const coords = this.facade.coordinates();
        this.ref.close(coords);
    }

    onCancel(): void {
        this.ref.close(null);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.searchSubject.complete();
        this.facade.clear();
    }
}
