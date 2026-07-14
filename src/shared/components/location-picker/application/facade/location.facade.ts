import { Injectable, signal, inject } from '@angular/core';

import { GEO_SERVICE } from '../../infrastructure/services/geo.service';
import { GeoLocation } from '../../domain/models/geo-location.model';

@Injectable()
export class LocationFacade {
    private readonly geoService = inject(GEO_SERVICE);

    private readonly geoLocation = signal<GeoLocation | null>(null);

    private readonly searchResultsSignal = signal<GeoLocation[]>([]);

    private readonly loadingSignal = signal(false);

    private readonly errorSignal = signal<string | null>(null);

    readonly selectedLocation = this.geoLocation.asReadonly();

    readonly searchResults = this.searchResultsSignal.asReadonly();

    readonly isSearching = this.loadingSignal.asReadonly();

    readonly error = this.errorSignal.asReadonly();

    select(location: GeoLocation): void {
        this.geoLocation.set(location);
        this.searchResultsSignal.set([]);
    }

    clear(): void {
        this.geoLocation.set(null);
        this.searchResultsSignal.set([]);
        this.errorSignal.set(null);
    }

    async search(query: string): Promise<void> {
        console.log('query: ', query);
        this.loadingSignal.set(true);

        this.errorSignal.set(null);

        try {
            const result = await this.geoService.geocode(query);
            console.log('result: ', result);

            this.searchResultsSignal.set(result);
        } catch {
            this.errorSignal.set('Erreur de recherche');
        } finally {
            this.loadingSignal.set(false);
        }
    }

    async reverse(lat: string, lng: string): Promise<GeoLocation> {
        const location = await this.geoService.reverseGeocode(lat, lng);

        this.geoLocation.set(location);

        return location;
    }
}
