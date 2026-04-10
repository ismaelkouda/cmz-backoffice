import { Injectable, signal, inject } from '@angular/core';
import { debounceTime, Subject, switchMap } from 'rxjs';

import { GeocodeResult } from '../models/geo-result.model';
import { LocationCoordinates } from '../models/location-coordinates.model';
import { GEO_SERVICE } from '../services/geo.service';

@Injectable()
export class LocationFacade {
    private readonly geoService = inject(GEO_SERVICE);

    private readonly coords = signal<LocationCoordinates | null>(null);
    private readonly address = signal<string | null>(null);
    private readonly loading = signal(false);

    private readonly reverse$ = new Subject<LocationCoordinates>();

    readonly coordinates = this.coords.asReadonly();
    readonly currentAddress = this.address.asReadonly();
    readonly isLoading = this.loading.asReadonly();

    constructor() {
        this.reverse$
            .pipe(
                debounceTime(400),
                switchMap((c) => this.geoService.reverseGeocode(c.lat, c.lng))
            )
            .subscribe((res) => {
                this.address.set(res.address);
            });
    }

    public setCoordinates(coords: LocationCoordinates): void {
        this.coords.set(coords);
        this.reverse$.next(coords);
    }

    public clear(): void {
        this.coords.set(null);
        this.address.set(null);
    }

    async search(query: string): Promise<GeocodeResult[]> {
        return this.geoService.geocode(query);
    }
}
