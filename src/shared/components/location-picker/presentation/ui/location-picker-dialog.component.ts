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

    protected readonly currentLocationDisplay = computed(
        () =>
            this.facade.selectedLocation()?.displayName ??
            'Aucune position sélectionnée'
    );

    constructor() {
        const data = this.config.data;

        if (data?.initialCoords) {
            this.facade.select(data.initialCoords);
        }
    }

    onSearchChange(): void {
        this.facade.search(this.searchQuery());
    }

    onSelectSearchResult(location: GeoLocation): void {
        this.facade.select(location);
        this.searchQuery.set(location.displayName);
    }

    onMapCoordinatesChange(coords: GeoLocation): void {
        this.facade.select(coords);
    }
    onValidate(): void {
        this.ref.close(this.facade.selectedLocation());
    }

    onCancel(): void {
        this.ref.close(null);
    }
}
