import { Injectable, signal, inject } from '@angular/core';

import { GeocodeResult } from '../models/geo-result.model';
import { LocationCoordinates } from '../models/location-coordinates.model';
import { GEO_SERVICE } from '../services/geo.service';

@Injectable()
export class LocationFacade {
    private readonly geoService = inject(GEO_SERVICE);

    private readonly coords = signal<LocationCoordinates | null>(null);

    readonly coordinates = this.coords.asReadonly();

    public setCoordinates(coords: LocationCoordinates): void {
        this.coords.set(coords);
    }

    public clear(): void {
        this.coords.set(null);
    }

    async search(query: string): Promise<GeocodeResult[]> {
        return this.geoService.geocode(query);
    }
}
