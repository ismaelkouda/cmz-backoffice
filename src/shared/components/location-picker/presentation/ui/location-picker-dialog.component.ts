import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';

import { OlMapComponent } from '../components/ol-map.component';
import { LocationFacade } from '../../application/facade/location.facade';
import { LocationPickerData } from '../../models/location-picker-data.model';
import { GeoProxyService } from '../../infrastructure/services/geo-proxy.service';
import { GEO_SERVICE } from '../../infrastructure/services/geo.service';
import { GeoLocation } from '../../domain/models/geo-location.model';
import { LocationCoordinates } from '../../models/location-coordinates.model';
import { formatCoordinatesString } from '../../utils/coordinates.utils';

@Component({
    selector: 'app-location-picker-dialog',
    standalone: true,
    imports: [
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
export class LocationPickerDialogComponent {
    private readonly ref = inject(DynamicDialogRef);
    private readonly config = inject(DynamicDialogConfig<LocationPickerData>);
    protected readonly facade = inject(LocationFacade);

    protected readonly searchQuery = signal('');

    protected readonly searchResults = this.facade.searchResults;

    protected readonly isSearching = this.facade.isSearching;

    protected readonly error = this.facade.error;

    protected readonly currentLocationDisplay = computed(() => {
        const location = this.facade.selectedLocation();
        if (!location) {
            return '';
        }

        return formatCoordinatesString(
            Number(location.lat),
            Number(location.lng)
        );
    });

    protected readonly currentAddressDisplay = computed(() => {
        return this.facade.selectedLocation()?.displayName ?? '';
    });

    constructor() {
        const data = this.config.data;

        if (data?.initialCoords) {
            this.facade.select(data.initialCoords);
            this.searchQuery.set(data.initialCoords.displayName);
        }
    }

    onSearchQueryChange(query: string): void {
        this.searchQuery.set(query);
        this.facade.search(query);
    }

    onSelectSearchResult(location: GeoLocation): void {
        this.facade.select(location);
        this.searchQuery.set(location.displayName);
    }

    async onMapCoordinatesChange(coords: LocationCoordinates): Promise<void> {
        const location = await this.facade.reverse(
            String(coords.latitude),
            String(coords.longitude)
        );

        this.searchQuery.set(
            location.name ?? location.municipality ?? location.displayName
        );
    }
    onValidate(): void {
        this.ref.close(this.facade.selectedLocation());
    }

    onCancel(): void {
        this.ref.close(null);
    }
}
