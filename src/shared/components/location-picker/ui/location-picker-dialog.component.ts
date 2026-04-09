import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    inject,
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

import { OlMapComponent } from '../components/ol-map.component';
import { GeocodeResult } from '../models/geo-result.model';
import { LocationPickerData } from '../models/location-picker-data.model';
import { GeoService } from '../services/geo.service';
import { LocationStateService } from '../services/location-state.service';
import { formatCoordinatesString } from '../utils/coordinates.validator';
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
    templateUrl: './location-picker-dialog.component.html',
    styleUrls: ['./location-picker-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationPickerDialogComponent {
    private readonly ref = inject(DynamicDialogRef);
    private readonly config = inject(DynamicDialogConfig<LocationPickerData>);
    private readonly locationState = inject(LocationStateService);
    private readonly geoService = inject(GeoService, { optional: true });

    // État
    readonly searchQuery = signal('');
    readonly searchResults = signal<GeocodeResult[]>([]);
    readonly selectedCoordinates = signal<Coordinates | null>(null);
    readonly currentAddress = signal<string | null>(null);
    readonly isSearching = signal(false);

    // Inputs du modal
    readonly initialCoordinates = signal<Coordinates | null>(null);
    readonly initialZoom = signal<number>(15);

    // Computed display
    readonly currentCoordinatesDisplay = computed(() => {
        const coords = this.selectedCoordinates();
        if (coords) {
            return formatCoordinatesString(coords.latitude, coords.longitude);
        }
        return 'Aucune position sélectionnée';
    });

    // Mobile detection
    readonly isMobile = signal(isMobile());

    constructor() {
        // Récupération des données du modal
        const data = this.config.data;
        if (data?.initialCoordinates) {
            this.initialCoordinates.set(data.initialCoordinates);
            this.selectedCoordinates.set(data.initialCoordinates);
            this.locationState.setSelected(data.initialCoordinates);
        }
        if (data?.initialZoom) {
            this.initialZoom.set(data.initialZoom);
        }

        // Synchronisation avec le service d'état
        effect(() => {
            const coords = this.locationState.selectedCoordinates();
            if (coords) {
                this.selectedCoordinates.set(coords);
                // Optionnel: reverse geocoding pour l'adresse
                this.loadAddressForCoordinates(
                    coords.latitude,
                    coords.longitude
                );
            }
        });
    }

    onSearchChange() {
        const query = this.searchQuery();
        if (query.length < 3) {
            this.searchResults.set([]);
            return;
        }

        // Debounce manuel pour simplicité
        const timeoutId = setTimeout(async () => {
            if (this.geoService && query === this.searchQuery()) {
                this.isSearching.set(true);
                const results = await this.geoService.geocode(query);
                this.searchResults.set(results);
                this.isSearching.set(false);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }

    onSelectSearchResult(result: GeocodeResult): void {
        this.locationState.setSelected({
            latitude: result.lat,
            longitude: result.lng,
        } as Coordinates);
        this.searchQuery.set(result.displayName);
        this.searchResults.set([]);
    }

    private async loadAddressForCoordinates(
        lat: number,
        lng: number
    ): Promise<void> {
        if (!this.geoService) {
            return;
        }

        try {
            const result = await this.geoService.reverseGeocode(lat, lng);
            if (result?.address) {
                this.currentAddress.set(result.address);
            }
        } catch (error) {
            console.warn('[LocationPicker] Reverse geocoding failed:', error);
        }
    }

    copyAddress(): void {
        const address = this.currentAddress();
        if (address) {
            navigator.clipboard.writeText(address);
            // Optionnel: toast de confirmation
        }
    }

    onValidate(): void {
        const coords = this.selectedCoordinates();
        this.ref.close(coords);
    }

    onCancel(): void {
        this.ref.close(null);
    }
}
